from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db import get_session
from typing import Optional, Dict, Any
import json
import sys
import os
from datetime import datetime
import logging
import uuid
from collections import defaultdict
from supabase import create_client, Client
from dotenv import load_dotenv

# Add the GoogleMeetAPI directory to the path so we can import from create_and_monitor
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'GoogleMeetAPI'))

# Import the get_bot function from create_and_monitor
from create_and_monitor import get_bot
from video_downloader import download_video_from_s3, list_downloaded_videos

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Create the FastAPI app
app = FastAPI(
    title="Student Engagement Dashboard API",
    description="API for student engagement tracking and Recall.ai webhook handling",
    version="1.0.0"
)

# Pydantic models
class WebhookResponse(BaseModel):
    status: str
    message: str
    processed_at: str
    bot_data: Optional[Dict[str, Any]] = None

# Root route
@app.get("/")
def read_root():
    return {"message": "Student Engagement Dashboard API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Student engagement dashboard routes
@app.get("/students")
async def list_students(session: AsyncSession = Depends(get_session)):
    res = await session.execute(text(
        "SELECT s.id, first_name, last_name, email, AVG(engaged_percentage), COUNT(*), string_agg(name, ',') FROM public.students as s LEFT JOIN public.class_attendances as a on s.id = student_id JOIN public.class_sessions as c ON session_id = c.id GROUP BY s.id"
    ))
    return [{"id": row["id"], "email": row["email"], "first_name": row["first_name"], "last_name": row["last_name"], "average_engagement": row["avg"], "total_sessions": row["count"], 'classes': row['string_agg'] } for row in res.mappings().all()]

@app.get("/students/at-risk")
async def list_at_risk_students(session: AsyncSession = Depends(get_session)):
    res = await session.execute(text(
        "SELECT s.id, first_name, last_name, email, AVG(engaged_percentage) as avg, COUNT(*), string_agg(name, ',') FROM public.students as s LEFT JOIN public.class_attendances as a on s.id = student_id JOIN public.class_sessions as c ON session_id = c.id GROUP BY s.id ORDER BY avg ASC LIMIT 3"
    ))
    return [{"id": row["id"], "email": row["email"], "first_name": row["first_name"], "last_name": row["last_name"], "average_engagement": row["avg"], "total_sessions": row["count"], 'classes': row['string_agg'] } for row in res.mappings().all()]

@app.get("/class-sessions")
async def list_class_sessions(session: AsyncSession = Depends(get_session)):
    res = await session.execute(text(
        "SELECT id, name, AVG(engaged_percentage), COUNT(*), start_time, duration FROM public.class_sessions LEFT JOIN public.class_attendances ON id = session_id GROUP BY id"
    ))
    return [{"id": row["id"], "average_engagement": row["avg"], "name": row["name"], "num_students": row["count"],"start_time": row["start_time"], "duration": row["duration"]} for row in res.mappings().all()]

@app.get("/metrics")
async def list_metrics(session: AsyncSession = Depends(get_session)):
    res = await session.execute(text(
        "SELECT AVG(engaged_percentage) as engagement, COUNT(DISTINCT student_id) as num_students, AVG(confused_percentage) as confusion, AVG(duration) as duration FROM public.class_attendances JOIN public.class_sessions ON session_id = id"
    ))
    metrics = res.mappings().all()[0]
    print(metrics)
    return metrics

# Main Recall webhook endpoint
@app.post("/webhook/recall/", response_model=WebhookResponse)
async def recall_webhook(request: Request):
    """
    Handle Recall.ai webhook events and call get_bot with the bot_id
    """
    try:
        # Get the raw body
        body = await request.body()
        
        # Parse JSON data
        try:
            webhook_data = json.loads(body)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON data")
        
        # Extract bot_id from webhook data
        # Based on the Recall.ai webhook format: data.bot.id
        bot_id = None
        
        # Try different possible locations for bot_id
        if "data" in webhook_data and "bot" in webhook_data["data"]:
            bot_id = webhook_data["data"]["bot"].get("id")
        elif "bot_id" in webhook_data:
            bot_id = webhook_data.get("bot_id")
        elif "bot" in webhook_data and "id" in webhook_data["bot"]:
            bot_id = webhook_data["bot"].get("id")
        
        if not bot_id:
            logger.warning("No bot_id found in webhook data")
            logger.info(f"Webhook data structure: {webhook_data}")
            return WebhookResponse(
                status="warning",
                message="No bot_id found in webhook data",
                processed_at=datetime.now().isoformat()
            )
        
        logger.info(f"Received Recall webhook for bot_id: {bot_id}")
        
        # Call get_bot function from create_and_monitor.py
        bot_data = get_bot(bot_id)
        
        if bot_data:
            logger.info(f"Successfully retrieved bot data for {bot_id}")
            logger.info(f"Bot data keys: {list(bot_data.keys()) if isinstance(bot_data, dict) else 'Not a dict'}")
            
            # Extract video download URL from bot data
            video_download_url = None
            recording_id = None
            
            # Navigate through the nested structure to find video download URL
            if "recordings" in bot_data and len(bot_data["recordings"]) > 0:
                recording = bot_data["recordings"][0]  # Get first recording
                recording_id = recording.get("id")
                logger.info(f"Found recording with ID: {recording_id}")
                logger.info(f"Recording keys: {list(recording.keys())}")
                
                if "media_shortcuts" in recording and "video_mixed" in recording["media_shortcuts"]:
                    video_mixed = recording["media_shortcuts"]["video_mixed"]
                    logger.info(f"Video mixed keys: {list(video_mixed.keys())}")
                    if "data" in video_mixed and "download_url" in video_mixed["data"]:
                        video_download_url = video_mixed["data"]["download_url"]
                        logger.info(f"✅ VIDEO DOWNLOAD URL FOUND: {video_download_url[:100]}...")
                        
                        # Download the video
                        logger.info(f"Starting video download for bot {bot_id}")
                        download_result = download_video_from_s3(video_download_url, bot_id)
                        
                        if download_result["status"] == "success":
                            logger.info(f"✅ Video downloaded successfully!")
                            logger.info(f"File path: {download_result['video_path']}")
                            logger.info(f"File size: {download_result['file_size']:,} bytes")
                        else:
                            logger.error(f"❌ Video download failed: {download_result['error']}")
                    else:
                        logger.warning("❌ No download_url in video_mixed.data")
                else:
                    logger.warning("❌ No video_mixed in media_shortcuts")
            else:
                logger.warning("❌ No recordings found in bot_data")
            
            # Extract transcript download URL as well
            transcript_download_url = None
            if "recordings" in bot_data and len(bot_data["recordings"]) > 0:
                recording = bot_data["recordings"][0]
                if "media_shortcuts" in recording and "transcript" in recording["media_shortcuts"]:
                    transcript = recording["media_shortcuts"]["transcript"]
                    if "data" in transcript and "download_url" in transcript["data"]:
                        transcript_download_url = transcript["data"]["download_url"]
                        logger.info(f"✅ TRANSCRIPT DOWNLOAD URL FOUND: {transcript_download_url[:100]}...")
            
            # Prepare response data
            response_data = {
                "video_download_url": video_download_url
            }
            
            # Add download info if video was downloaded
            if video_download_url and 'download_result' in locals():
                response_data["download_status"] = download_result["status"]
                if download_result["status"] == "success":
                    response_data["video_path"] = download_result["video_path"]
                    response_data["file_size"] = download_result["file_size"]
                    response_data["download_time"] = download_result["download_time"]
                else:
                    response_data["download_error"] = download_result["error"]
            
            return WebhookResponse(
                status="success",
                message=f"Webhook processed successfully for bot {bot_id}",
                processed_at=datetime.now().isoformat(),
                bot_data=response_data
            )
        else:
            logger.error(f"Failed to retrieve bot data for {bot_id}")
            return WebhookResponse(
                status="error",
                message=f"Failed to retrieve bot data for {bot_id}",
                processed_at=datetime.now().isoformat()
            )
            
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")

def process_json_and_store(json_path):
    with open(json_path, "r") as f:
        data = json.load(f)

    if not data:
        print("No frames found in file")
        return

    # Duration = last - first frame
    first_frame = data[0].get("timestamp", 0)
    last_frame = data[-1].get("timestamp", len(data) - 1)
    duration = (last_frame - first_frame)//60

    # Create new session
    session_id = str(uuid.uuid4())
    session_name = os.path.basename(json_path)

    supabase.table("class_sessions").insert({
        "id": session_id,
        "duration": duration,
        # optional if you add a "name" column
        # "name": session_name
    }).execute()

    print(f"✅ Created class session {session_name} ({session_id}), duration={duration}")

    # Count states
    state_counts = defaultdict(lambda: defaultdict(int))
    frame_counts = defaultdict(int)

    for frame in data:
        for face in frame.get("faces", []):
            face_id = str(face["face_id"])
            state = face["dominant_state"]
            state_counts[face_id][state] += 1
            frame_counts[face_id] += 1

    # Process each student
    for face_id, counts in state_counts.items():
        total = frame_counts[face_id]
        engaged = (counts.get("engaged", 0) / total) * 100
        disengaged = (counts.get("disengaged", 0) / total) * 100
        confused = (counts.get("confused", 0) / total) * 100

        # 1. Check if student exists by face_id
        existing = supabase.table("students").select("id").eq("face_id", face_id).execute()

        if existing.data:
            student_id = existing.data[0]["id"]
        else:
            student_id = str(uuid.uuid4())
            supabase.table("students").insert({
                "id": student_id,
                "face_id": face_id,
                "first_name": "Unknown",
                "last_name": "Unknown",
                "email": f"{face_id}@example.com"
            }).execute()

        # 2. Insert attendance
        supabase.table("class_attendances").upsert({
            "student_id": student_id,
            "session_id": session_id,
            "engaged_percentage": round(engaged, 2),
            "disengaged_percentage": round(disengaged, 2),
            "confused_percentage": round(confused, 2)
        }).execute()

        print(f"📊 Student {face_id} ({student_id}): "
              f"E={engaged:.2f}%, D={disengaged:.2f}%, C={confused:.2f}%")

def log_email(student_id: str, session_id: str, email_text: str):
    """
    Logs an email for a given student and session.
    Inserts into the 'emails' table. 'id' is auto-incrementing int8 (BIGSERIAL).
    """
    response = supabase.table("emails").insert({
        "student_id": student_id,
        "session_id": session_id,
        "email": email_text
    }).execute()

    if response.data:
        new_id = response.data[0]["id"]
        print(f"📧 Logged email id={new_id} for student={student_id}, session={session_id}")
    else:
        print("⚠️ Failed to insert email:", response)

    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
