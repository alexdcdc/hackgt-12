#!/usr/bin/env python3
"""
Test script for the API
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api import process_json_and_store

def test_process_data():
    """Test the process_json_and_store function"""
    print("🧪 Testing process_json_and_store function...")
    
    # Check if test_data.json exists
    json_path = "../test_data.json"
    if not os.path.exists(json_path):
        print(f"❌ test_data.json not found at {json_path}")
        return False
    
    print(f"📁 Found test_data.json at {json_path}")
    
    # Test the function
    try:
        process_json_and_store(json_path)
        print("✅ Function executed successfully!")
        return True
    except Exception as e:
        print(f"❌ Function failed: {e}")
        return False

if __name__ == "__main__":
    success = test_process_data()
    if success:
        print("\n🎉 Test completed successfully!")
    else:
        print("\n💥 Test failed!")
        sys.exit(1)
