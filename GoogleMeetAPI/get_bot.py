import requests
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get configuration from environment variables
region = os.getenv('RECALLAI_REGION', 'us')
api_key = os.getenv('RECALLAI_API_KEY')

# Validate required environment variables
if not api_key:
    print("Error: RECALLAI_API_KEY environment variable is required")
    print("Please check your .env file and ensure the API key is set.")
    sys.exit(1)

# Get bot ID from command line argument or environment variable
if len(sys.argv) > 1:
    bot_id = sys.argv[1]
elif os.getenv('RECALLAI_BOT_ID'):
    bot_id = os.getenv('RECALLAI_BOT_ID')
else:
    print("Usage: python get_bot.py <bot_id>")
    print("Or set RECALLAI_BOT_ID in your .env file")
    sys.exit(1)

url = f"https://{region}.recall.ai/api/v1/bot/{bot_id}"
headers = {"Authorization": f"Token {api_key}"}

try:
    resp = requests.get(url, headers=headers)
    print(f"Status Code: {resp.status_code}")
    
    if resp.status_code == 200:
        bot_data = resp.json()
        print(bot_data)
    else:
        print(f"Error: {resp.status_code}")
        print(resp.text)
        
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
