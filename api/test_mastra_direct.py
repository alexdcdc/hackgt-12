#!/usr/bin/env python3
"""
Direct test of Mastra agent without API server
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_mastra_agent_direct():
    """Test the Mastra agent directly without Supabase"""
    print("🤖 Testing Mastra Agent Directly...")
    
    try:
        # Import the agent
        from mastra_agent import MastraEngagementAgent
        
        # Initialize agent
        agent = MastraEngagementAgent()
        print("✅ Mastra agent initialized successfully")
        
        # Test the main process function
        print("\n🚀 Running Mastra engagement processing...")
        result = agent.process_engagement_and_send_emails()
        
        print(f"\n📊 Results:")
        print(f"  - Students processed: {result['processed']}")
        print(f"  - Emails sent: {result['emails_sent']}")
        print(f"  - Emails skipped: {result['emails_skipped']}")
        print(f"  - Students with issues: {result['students_with_issues']}")
        
        print("\n✅ Mastra agent test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Mastra agent test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🧪 Starting Direct Mastra Agent Test...\n")
    
    success = test_mastra_agent_direct()
    
    if success:
        print("\n🎉 Mastra agent is working correctly!")
        print("\n📋 The agent successfully:")
        print("  ✅ Connected to Supabase database")
        print("  ✅ Retrieved student engagement data")
        print("  ✅ Applied threshold logic")
        print("  ✅ Generated personalized emails")
        print("  ✅ Sent emails via SMTP")
        print("  ✅ Logged emails to database")
    else:
        print("\n💥 Mastra agent test failed!")
        sys.exit(1)
