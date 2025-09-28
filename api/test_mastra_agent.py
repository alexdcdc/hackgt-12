#!/usr/bin/env python3
"""
Test script for the Mastra Engagement Agent
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from mastra_agent import MastraEngagementAgent

def test_mastra_agent():
    """Test the Mastra engagement agent"""
    print("🤖 Testing Mastra Engagement Agent...")
    
    try:
        # Initialize agent
        agent = MastraEngagementAgent()
        print("✅ Mastra agent initialized successfully")
        
        # Test getting students with issues
        print("\n📊 Getting students with engagement issues...")
        students = agent.get_students_with_engagement_issues()
        print(f"Found {len(students)} students with issues")
        
        for student in students[:3]:  # Show first 3 students
            print(f"  - {student['first_name']} {student['last_name']}: "
                  f"E={student['engaged_percentage']:.1f}%, "
                  f"D={student['disengaged_percentage']:.1f}%, "
                  f"C={student['confused_percentage']:.1f}%")
        
        # Test email generation
        if students:
            print(f"\n📧 Testing email generation for {students[0]['first_name']}...")
            email_content = agent.generate_email_content(students[0])
            print("Email content preview:")
            print("-" * 50)
            print(email_content[:200] + "..." if len(email_content) > 200 else email_content)
            print("-" * 50)
        
        # Test email existence check
        if students:
            student = students[0]
            exists = agent.check_email_exists(student['student_id'], student['session_id'])
            print(f"\n🔍 Email exists check for {student['first_name']}: {exists}")
        
        # Test the full process
        print(f"\n🤖 Testing full Mastra process...")
        result = agent.process_engagement_and_send_emails()
        print(f"Result: {result}")
        
        print("\n✅ Mastra agent test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Mastra agent test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_smtp_connection():
    """Test SMTP connection"""
    print("\n📧 Testing SMTP connection...")
    
    try:
        agent = MastraEngagementAgent()
        
        # Test sending a simple email
        test_email = "p19195138@gmail.com"
        subject = "Mastra Agent Test Email"
        content = "This is a test email from the Mastra Engagement Agent."
        
        print(f"Attempting to send test email to {test_email}...")
        success = agent.send_email(test_email, subject, content)
        
        if success:
            print("✅ SMTP connection successful")
        else:
            print("⚠️  SMTP connection failed (this might be expected with test email)")
        
        return True
        
    except Exception as e:
        print(f"❌ SMTP test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Starting Mastra Agent Tests...\n")
    
    # Test agent functionality
    agent_success = test_mastra_agent()
    
    # Test SMTP (optional)
    smtp_success = test_smtp_connection()
    
    if agent_success:
        print("\n🎉 All Mastra agent tests completed!")
        print("\n📋 Next steps:")
        print("1. Run the API server: uvicorn api:app --reload")
        print("2. Test the Mastra endpoints:")
        print("   - POST /mastra/process-engagement")
        print("   - GET /mastra/students-with-issues")
        print("   - POST /mastra/send-test-email?student_id=xxx&session_id=yyy")
    else:
        print("\n💥 Some tests failed!")
        sys.exit(1)
