import requests
import os
import sys
import time
import urllib3
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def create_bot(meeting_url, bot_name=None):
    """Create a new bot and return bot data"""
    region = os.getenv('RECALLAI_REGION', 'us')
    api_key = os.getenv('RECALLAI_API_KEY')
    
    if not api_key:
        print("Error: RECALLAI_API_KEY environment variable is required")
        return None
    
    if not bot_name:
        bot_name = f"Bot-{int(time.time())}"
    
    url = f"https://{region}.recall.ai/api/v1/bot"
    headers = {"Authorization": f"Token {api_key}"}
    
    config = {
        "meeting_url": meeting_url,
        "bot_name": bot_name,
        "recording_config": {
            "transcript": {
                "provider": {"meeting_captions": {}}
            },
            "video_mixed_layout": "gallery_view_v2",
            "video_mixed_participant_video_when_screenshare": "overlap"
        }
    }
    
    try:
        print(f"Creating bot for: {meeting_url}")
        resp = requests.post(url, headers=headers, json=config)
        
        if resp.status_code == 201:
            bot_data = resp.json()
            print(f"Bot created! ID: {bot_data['id']}")
            return bot_data
        else:
            print(f"Failed to create bot: {resp.status_code}")
            print(resp.text)
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def get_bot(bot_id):
    """Get bot details by ID"""
    region = os.getenv('RECALLAI_REGION', 'us')
    api_key = os.getenv('RECALLAI_API_KEY')
    
    url = f"https://{region}.recall.ai/api/v1/bot/{bot_id}"
    headers = {"Authorization": f"Token {api_key}"}
    
    try:
        resp = requests.get(url, headers=headers)
        
        if resp.status_code == 200:
            return resp.json()
        else:
            print(f" Failed to get bot: {resp.status_code}")
            return None
            
    except Exception as e:
        print(f" Error: {e}")
        return None

def main():
    if len(sys.argv) < 2:
        print("Usage: python create_and_monitor.py <meeting_url> [bot_name]")
        print("Example: python create_and_monitor.py 'https://meet.google.com/abc-defg-hij'")
        sys.exit(1)
    
    meeting_url = sys.argv[1]
    bot_name = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Step 1: Create bot
    print("=" * 40)
    print("STEP 1: Creating Bot")
    print("=" * 40)
    bot_data = create_bot(meeting_url, bot_name)
    
    if not bot_data:
        print("Failed to create bot. Exiting.")
        sys.exit(1)
    
    bot_id = bot_data['id']
    
    # Step 2: Get bot details
    print("\n" + "=" * 40)
    print("STEP 2: Getting Bot Details")
    print("=" * 40)
    bot_details = get_bot(bot_id)
    
    if bot_details:
        print("Bot Details:")
        print(f"  ID: {bot_details.get('id')}")
        print(f"  Name: {bot_details.get('bot_name')}")
        print(f"  Status: {bot_details.get('status')}")
        print(f"  Meeting URL: {bot_details.get('meeting_url')}")
        print(f"  Created: {bot_details.get('join_at')}")
        
        # Optional: Monitor status
        print("\n" + "=" * 40)
        print("STEP 3: Monitoring Status")
        print("=" * 40)
        print("Bot will join the meeting automatically when it starts.")
        print("You can run 'python get_bot.py <bot_id>' to check status later.")
        print(f"Bot ID: {bot_id}")
        # Wait for webhook to then call get_bot
    else:
        print("Failed to get bot details.")

if __name__ == "__main__":
    main()
