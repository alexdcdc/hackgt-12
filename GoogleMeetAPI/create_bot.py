import requests
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Validate required environment variables
required_vars = ['RECALLAI_API_KEY', 'RECALLAI_REGION']
missing_vars = [var for var in required_vars if not os.getenv(var)]

if missing_vars:
    print(f"Error: Missing required environment variables: {', '.join(missing_vars)}")
    print("Please check your .env file and ensure all required variables are set.")
    exit(1)

# Get meeting URL from command line argument
if len(sys.argv) < 2:
    print("Usage: python test.py <meeting_url>")
    print("Example: python test.py https://meet.google.com/abc-defg-hij")
    exit(1)

meeting_url = str(sys.argv[1])

url = f"https://{os.getenv('RECALLAI_REGION')}.recall.ai/api/v1/bot"
headers = {
    "Authorization": f"Token {os.getenv('RECALLAI_API_KEY')}",
    "Content-Type": "application/json"
}
data = {
    "meeting_url": meeting_url,
    "bot_name": os.getenv("BOT_NAME", "My Recording Bot"),
    "recording_config": {
        "transcript": {
            "provider": {"meeting_captions": {}}
        },
        "video_mixed_layout": "gallery_view_v2",
        "video_mixed_participant_video_when_screenshare": "overlap"
    }
}

resp = requests.post(url, headers=headers, json=data)
print(resp.status_code)
print(resp.json())
