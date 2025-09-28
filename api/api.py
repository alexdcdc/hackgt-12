# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import os
import json
import uuid
from collections import defaultdict
from supabase import create_client, Client
from dotenv import load_dotenv

# Create the FastAPI app
app = FastAPI(
    title="My FastAPI App",
    description="A boilerplate FastAPI project",
    version="0.1.0"
)


# Root route
@app.get("/")
def read_root():
    return {"message": "Hello world"}


load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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

if __name__ == "__main__":
    process_json_and_store("test_data.json")