"""
Simple FastAPI app for testing Mastra agent without database dependencies
"""
from fastapi import FastAPI, HTTPException
from mastra_agent import MastraEngagementAgent
import os
from dotenv import load_dotenv

# Create the FastAPI app
app = FastAPI(
    title="Mastra Agent API",
    description="Simple API for testing Mastra engagement agent",
    version="1.0.0"
)

load_dotenv()

# Root route
@app.get("/")
def read_root():
    return {"message": "Mastra Agent API is running"}

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
        student_result = agent.supabase.table("students").select("*").eq("id", student_id).execute()
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
