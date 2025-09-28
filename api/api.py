from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
import sys
import os
from datetime import datetime
import logging

# Add the GoogleMeetAPI directory to the path so we can import from create_and_monitor
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'GoogleMeetAPI'))

# Import the get_bot function from create_and_monitor
from create_and_monitor import get_bot
from video_downloader import download_video_from_s3, list_downloaded_videos
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the FastAPI app
app = FastAPI(
    title="Recall Webhook Handler",
    description="Simple webhook handler for Recall.ai that calls get_bot",
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
    return {"message": "Recall Webhook Handler", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)