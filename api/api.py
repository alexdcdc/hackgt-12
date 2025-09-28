# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db import get_session
import os
import json
import uuid
from collections import defaultdict
from supabase import create_client, Client
from dotenv import load_dotenv
from mastra_agent import MastraEngagementAgent

# Create the FastAPI app
app = FastAPI(
    title="My FastAPI App",
    description="A boilerplate FastAPI project",
    version="0.1.0"
)

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Root route
@app.get("/")
def read_root():
    return {"message": "Hello world"}


@app.get("/students")
async def list_students(session: AsyncSession = Depends(get_session)):
    res = await session.execute(text(
        "SELECT s.id, first_name, last_name, email, AVG(engaged_percentage), COUNT(*), string_agg(name, ',') FROM public.students as s LEFT JOIN public.class_attendances as a on s.id = student_id JOIN public.class_sessions as c ON session_id = c.id GROUP BY s.id"
    ))
    return [{"id": row["id"], "email": row["email"], "first_name": row["first_name"], "last_name": row["last_name"], "average_engagement": row["avg"], "total_sessions": row["count"], 'classes': row['string_agg'] } for row in res.mappings().all()]

@app.get("/class-sessions")
async def list_class_sessions(session: AsyncSession = Depends(get_session)):
    res = await session.execute(text(
        "SELECT * FROM public.class_sessions ORDER BY id"
    ))
    return [{"id": row["id"], "duration": row["duration"]} for row in res.mappings().all()]

# Mastra Agent Endpoints
@app.post("/mastra/process-engagement")
async def process_engagement():
    """Trigger the Mastra agent to process engagement and send emails"""
    try:
        agent = MastraEngagementAgent()
        result = agent.process_engagement_and_send_emails()
        return {
            "success": True,
            "message": "Mastra engagement processing completed",
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing engagement: {str(e)}")

@app.get("/mastra/students-with-issues")
async def get_students_with_issues():
    """Get list of students with engagement issues"""
    try:
        agent = MastraEngagementAgent()
        students = agent.get_students_with_engagement_issues()
        return {
            "success": True,
            "students": students,
            "count": len(students)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting students: {str(e)}")

@app.post("/mastra/send-test-email")
async def send_test_email(student_id: str, session_id: str):
    """Send a test email to a specific student"""
    try:
        agent = MastraEngagementAgent()
        
        # Get student data
        student_result = supabase.table("students").select("*").eq("id", student_id).execute()
        if not student_result.data:
            raise HTTPException(status_code=404, detail="Student not found")
        
        student = student_result.data[0]
        
        # Check if email already exists
        if agent.check_email_exists(student_id, session_id):
            return {
                "success": False,
                "message": "Email already exists for this student and session"
            }
        
        # Generate and send email
        first_name = student.get('first_name', student.get('fname', 'Unknown'))
        last_name = student.get('last_name', student.get('lname', 'Unknown'))
        
        email_content = agent.generate_email_content({
            'first_name': first_name,
            'last_name': last_name,
            'email': student['email'],
            'engaged_percentage': 30.0,  # Mock low engagement
            'disengaged_percentage': 60.0,
            'confused_percentage': 10.0
        })
        subject = f"Test Email - {first_name}"
        
        if agent.send_email(student['email'], subject, email_content):
            agent.log_email(student_id, session_id, email_content)
            return {
                "success": True,
                "message": f"Test email sent to {student['email']}"
            }
        else:
            return {
                "success": False,
                "message": "Failed to send email"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending test email: {str(e)}")


def process_json_and_store(json_path):
    with open(json_path, "r") as f:
        data = json.load(f)

    if not data:
        print("No frames found in file")
        return

    # Duration = last - first frame
    first_frame = data[0].get("frame_number", 0)
    last_frame = data[-1].get("frame_number", len(data) - 1)
    duration = last_frame - first_frame

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
    sid = "0070e29b-9b6a-41c0-88dd-f1d4f06a6856"
    sessid = "96e38c7d-071d-4a99-91d8-a9128f162af4"
    log_email(sid, sessid, "Follow-up: Please review the materials from last session.")