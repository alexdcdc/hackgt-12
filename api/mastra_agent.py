"""
Mastra Agent for Student Engagement Monitoring and Email Sending
"""
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, List, Optional
import os
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class MastraEngagementAgent:
    def __init__(self):
        # SMTP Configuration
        self.smtp_host = "smtp.gmail.com"
        self.smtp_port = 587
        self.smtp_user = "p19195138@gmail.com"
        self.smtp_from = "noreply@example.com"
        self.smtp_pass = "gatp lntf fbcf agaq"
        
        # Supabase Configuration
        self.supabase_url = os.environ["SUPABASE_URL"]
        self.supabase_key = os.environ["SUPABASE_KEY"]
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        # Engagement thresholds
        self.thresholds = {
            "engaged_percentage": 50.0,    # Below 50% engagement triggers email
            "disengaged_percentage": 70.0,  # Above 70% disengagement triggers email
            "confused_percentage": 60.0     # Above 60% confusion triggers email
        }
    
    def get_students_with_engagement_issues(self) -> List[Dict]:
        """Get students whose engagement metrics fall below thresholds"""
        try:
            # Get all students
            students_result = self.supabase.table("students").select("*").execute()
            
            if not students_result.data:
                print("No students found in database")
                return []
            
            # Get all attendance records
            attendances_result = self.supabase.table("class_attendances").select("*").execute()
            
            if not attendances_result.data:
                print("No attendance data found in database")
                return []
            
            # Group attendances by student_id
            student_attendances = {}
            for attendance in attendances_result.data:
                student_id = attendance['student_id']
                if student_id not in student_attendances:
                    student_attendances[student_id] = []
                student_attendances[student_id].append(attendance)
            
            # Find students with engagement issues
            students_with_issues = []
            for student in students_result.data:
                student_id = student['id']
                
                if student_id in student_attendances:
                    # Get the most recent attendance for this student
                    attendances = student_attendances[student_id]
                    latest_attendance = max(attendances, key=lambda x: x.get('created_at', ''))
                    
                    # Check if this student should receive an email
                    if self._should_send_email(latest_attendance):
                        students_with_issues.append({
                            'student_id': student_id,
                            'first_name': student.get('first_name', student.get('fname', 'Unknown')),
                            'last_name': student.get('last_name', student.get('lname', 'Unknown')),
                            'email': student['email'],
                            'engaged_percentage': latest_attendance['engaged_percentage'],
                            'disengaged_percentage': latest_attendance['disengaged_percentage'],
                            'confused_percentage': latest_attendance['confused_percentage'],
                            'session_id': latest_attendance['session_id']
                        })
            
            return students_with_issues
            
        except Exception as e:
            print(f"❌ Error getting students with engagement issues: {e}")
            return []
    
    def _should_send_email(self, attendance_data: Dict) -> bool:
        """Check if email should be sent based on thresholds"""
        engaged = attendance_data.get('engaged_percentage', 0)
        disengaged = attendance_data.get('disengaged_percentage', 0)
        confused = attendance_data.get('confused_percentage', 0)
        
        return (
            engaged < self.thresholds['engaged_percentage'] or
            disengaged > self.thresholds['disengaged_percentage'] or
            confused > self.thresholds['confused_percentage']
        )
    
    def check_email_exists(self, student_id: str, session_id: str) -> bool:
        """Check if email already exists for this student and session"""
        try:
            result = self.supabase.table("emails").select("id").eq("student_id", student_id).eq("session_id", session_id).execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"❌ Error checking email existence: {e}")
            return False
    
    def generate_email_content(self, student_data: Dict) -> str:
        """Generate personalized email content based on student metrics"""
        first_name = student_data['first_name']
        engaged = student_data['engaged_percentage']
        disengaged = student_data['disengaged_percentage']
        confused = student_data['confused_percentage']
        
        # Determine the main issue
        issues = []
        if engaged < self.thresholds['engaged_percentage']:
            issues.append("low engagement")
        if disengaged > self.thresholds['disengaged_percentage']:
            issues.append("high disengagement")
        if confused > self.thresholds['confused_percentage']:
            issues.append("confusion")
        
        issue_text = ", ".join(issues)
        
        email_content = f"""
Dear {first_name},

I hope this email finds you well. I wanted to reach out regarding your recent class participation.

I've noticed some patterns in your engagement that I'd like to discuss:
- Engagement Level: {engaged:.1f}%
- Disengagement Level: {disengaged:.1f}%
- Confusion Level: {confused:.1f}%

It appears you may be experiencing {issue_text} during our recent sessions. I want to make sure you're getting the most out of your learning experience.

Here are some suggestions that might help:
- Don't hesitate to ask questions when something isn't clear
- Take notes to stay focused and engaged
- Participate more actively in discussions
- Let me know if you need additional resources or clarification

I'm here to support your success. Please feel free to reach out if you have any questions or concerns.

Best regards,
Your Instructor

---
This is an automated message based on your class participation metrics.
        """.strip()
        
        return email_content
    
    def send_email(self, to_email: str, subject: str, content: str) -> bool:
        """Send email using SMTP"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.smtp_from
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add body to email
            msg.attach(MIMEText(content, 'plain'))
            
            # Create SMTP session with SSL context
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE  # For development only
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls(context=context)
                server.login(self.smtp_user, self.smtp_pass)
                server.send_message(msg)
            
            print(f"✅ Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending email to {to_email}: {e}")
            return False
    
    def log_email(self, student_id: str, session_id: str, email_content: str) -> bool:
        """Log email in database"""
        try:
            response = self.supabase.table("emails").insert({
                "student_id": student_id,
                "session_id": session_id,
                "email": email_content
            }).execute()
            
            if response.data:
                print(f"📧 Email logged in database for student {student_id}")
                return True
            else:
                print(f"❌ Failed to log email: {response}")
                return False
                
        except Exception as e:
            print(f"❌ Error logging email: {e}")
            return False
    
    def process_engagement_and_send_emails(self) -> Dict:
        """Main function to process engagement and send emails"""
        print("🤖 Starting Mastra engagement monitoring...")
        
        # Get students with engagement issues
        students_with_issues = self.get_students_with_engagement_issues()
        
        if not students_with_issues:
            print("✅ No students found with engagement issues")
            return {"processed": 0, "emails_sent": 0, "emails_skipped": 0}
        
        print(f"📊 Found {len(students_with_issues)} students with engagement issues")
        
        processed = 0
        emails_sent = 0
        emails_skipped = 0
        
        for student in students_with_issues:
            student_id = student['student_id']
            session_id = student['session_id']
            email = student['email']
            
            # Check if email already exists
            if self.check_email_exists(student_id, session_id):
                print(f"⏭️  Skipping {student['first_name']} - email already sent")
                emails_skipped += 1
                continue
            
            # Generate email content
            email_content = self.generate_email_content(student)
            subject = f"Class Engagement Follow-up - {student['first_name']}"
            
            # Send email
            if self.send_email(email, subject, email_content):
                # Log email in database
                if self.log_email(student_id, session_id, email_content):
                    emails_sent += 1
                else:
                    print(f"⚠️  Email sent but failed to log for {student['first_name']}")
            else:
                print(f"❌ Failed to send email to {student['first_name']}")
            
            processed += 1
        
        result = {
            "processed": processed,
            "emails_sent": emails_sent,
            "emails_skipped": emails_skipped,
            "students_with_issues": len(students_with_issues)
        }
        
        print(f"🎉 Mastra processing complete: {emails_sent} emails sent, {emails_skipped} skipped")
        return result

# Example usage
if __name__ == "__main__":
    agent = MastraEngagementAgent()
    result = agent.process_engagement_and_send_emails()
    print(f"Final result: {result}")
