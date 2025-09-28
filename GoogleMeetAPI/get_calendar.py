import os.path
import datetime as dt

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# --- CONFIGURATION ---
# Scopes define the permissions you're asking for.
# We need to read calendar events and access Google Drive files.
SCOPES = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/drive.readonly"
]
# File to store the user's access and refresh tokens.
# It's created automatically on the first run.
TOKEN_FILE = 'token.json'
# Your credentials file downloaded from Google Cloud Console.
CREDENTIALS_FILE = 'credentials.json'

def authenticate():
    """Handles the OAuth2 authentication flow."""
    creds = None
    # The file token.json stores the user's access and refresh tokens.
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"Token refresh failed: {e}. Please re-authenticate.")
                os.remove(TOKEN_FILE)
                return authenticate() # Retry authentication
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the credentials for the next run
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())

    return creds

def main():
    """
    Finds recent Google Calendar events, checks for attached Meet recordings,
    and retrieves their metadata from Google Drive.
    """
    print("Authenticating with Google APIs...")
    try:
        creds = authenticate()
    except FileNotFoundError:
        print(f"ERROR: The '{CREDENTIALS_FILE}' was not found.")
        print("Please download it from the Google Cloud Console and place it in the same directory.")
        return
    except Exception as e:
        print(f"An unexpected error occurred during authentication: {e}")
        return

    print("Authentication successful.\n")

    try:
        # Build the service objects for Calendar and Drive
        calendar_service = build('calendar', 'v3', credentials=creds)
        drive_service = build('drive', 'v3', credentials=creds)

        # --- Step 1: Find recent calendar events ---
        print("Searching for calendar events in the last 24 hours...")
        now = dt.datetime.utcnow()
        time_min = (now - dt.timedelta(days=1)).isoformat() + 'Z'  # 'Z' indicates UTC time
        time_max = now.isoformat() + 'Z'

        events_result = calendar_service.events().list(
            calendarId='primary',
            timeMin=time_min,
            timeMax=time_max,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        events = events_result.get('items', [])

        if not events:
            print("No upcoming events found in the last 24 hours.")
            return

        print(f"Found {len(events)} event(s).\n")
        found_recording = False

        # --- Step 2: Check events for recording attachments ---
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            print(f"-> Checking Event: '{event['summary']}' at {start}")

            if 'attachments' in event:
                for attachment in event['attachments']:
                    # Meet recordings are linked with a specific icon
                    if "drive.google.com" in attachment['fileUrl'] and "video" in attachment.get('iconLink', ''):
                        found_recording = True
                        file_id = attachment['fileId']
                        print(f"  [SUCCESS] Found Meet recording attachment!")
                        print(f"  - File URL: {attachment['fileUrl']}")
                        print(f"  - File ID: {file_id}")

                        # --- Step 3: Use Drive API to get file metadata ---
                        try:
                            print("  - Fetching file details from Google Drive...")
                            file_metadata = drive_service.files().get(
                                fileId=file_id,
                                fields='name, mimeType, size, webViewLink'
                            ).execute()
                            
                            file_size_mb = int(file_metadata.get('size', 0)) / (1024*1024)

                            print(f"    - File Name: {file_metadata.get('name')}")
                            print(f"    - Type: {file_metadata.get('mimeType')}")
                            print(f"    - Size: {file_size_mb:.2f} MB")
                            print(f"    - Drive Link: {file_metadata.get('webViewLink')}\n")

                        except HttpError as error:
                            print(f"    [ERROR] An error occurred fetching from Drive: {error}\n")
            else:
                print("  - No attachments found for this event.\n")

        if not found_recording:
            print("Finished checking all events. No recordings were found attached.")


    except HttpError as error:
        print(f'An API error occurred: {error}')
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    main()
