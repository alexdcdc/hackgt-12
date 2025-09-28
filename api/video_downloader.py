import requests
import os
import sys
import logging
from datetime import datetime
from typing import Dict, Optional
from urllib.parse import urlparse
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'Facial-Emotion-Recognition-using-OpenCV-and-Deepface'))

import simplified_analyzer.py

def download_video_from_s3(s3_url: str, bot_id: str, custom_filename: Optional[str] = None) -> Dict:
    """
    Download video from AWS S3 URL to Facial-Emotion-Recognition directory
    
    Args:
        s3_url (str): The AWS S3 download URL
        bot_id (str): The bot ID for naming the file
        custom_filename (str, optional): Custom filename (without extension)
    
    Returns:
        Dict: Result containing status, file path, and metadata
    """
    try:
        # Set the target directory
        project_root = os.path.dirname(os.path.dirname(__file__))
        target_dir = os.path.join(project_root, 'Facial-Emotion-Recognition-using-OpenCV-and-Deepface')
        
        # Create directory if it doesn't exist
        os.makedirs(target_dir, exist_ok=True)
        
        # Create unique filename
        if custom_filename:
            video_filename = f"{custom_filename}.mp4"
        else:
            timestamp = int(datetime.now().timestamp())
            video_filename = f"video_{bot_id}_{timestamp}.mp4"
        
        video_path = os.path.join(target_dir, video_filename)
        
        logger.info(f"Downloading video from S3 for bot {bot_id}")
        logger.info(f"S3 URL: {s3_url[:100]}...")
        logger.info(f"Target path: {video_path}")
        
        # Download the video with progress tracking
        start_time = time.time()
        
        with requests.get(s3_url, stream=True, timeout=300) as response:
            response.raise_for_status()
            
            # Get file size for progress tracking
            total_size = int(response.headers.get('content-length', 0))
            downloaded_size = 0
            
            logger.info(f"Starting download of {total_size} bytes to {video_path}")
            
            with open(video_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:  # Filter out keep-alive chunks
                        f.write(chunk)
                        downloaded_size += len(chunk)
                        
                        # Log progress every 10MB
                        if downloaded_size % (10 * 1024 * 1024) == 0:
                            progress = (downloaded_size / total_size * 100) if total_size > 0 else 0
                            logger.info(f"Download progress: {progress:.1f}% ({downloaded_size}/{total_size} bytes)")
        
        # Verify download
        file_size = os.path.getsize(video_path)
        download_time = time.time() - start_time
        
        logger.info(f"✅ Video downloaded successfully!")
        logger.info(f"File path: {video_path}")
        logger.info(f"File size: {file_size:,} bytes")
        logger.info(f"Download time: {download_time:.2f} seconds")
        logger.info(f"Download speed: {file_size / download_time / 1024 / 1024:.2f} MB/s")

        analysis = simplified_analyzer(video_path)
        
        return {
            "status": "success",
            "bot_id": bot_id,
            "video_path": video_path,
            "filename": video_filename,
            "file_size": file_size,
            "download_time": download_time,
            "download_speed_mbps": file_size / download_time / 1024 / 1024,
            "message": f"Video downloaded successfully to {video_path}"
        }
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error downloading video: {e}")
        return {
            "status": "error",
            "bot_id": bot_id,
            "error": f"Network error: {str(e)}",
            "message": f"Failed to download video due to network error: {str(e)}"
        }
        
    except Exception as e:
        logger.error(f"Error downloading video from S3: {e}")
        return {
            "status": "error",
            "bot_id": bot_id,
            "error": str(e),
            "message": f"Failed to download video: {str(e)}"
        }

def download_video_with_retry(s3_url: str, bot_id: str, max_retries: int = 3, custom_filename: Optional[str] = None) -> Dict:
    """
    Download video with retry logic for failed attempts
    
    Args:
        s3_url (str): The AWS S3 download URL
        bot_id (str): The bot ID for naming the file
        max_retries (int): Maximum number of retry attempts
        custom_filename (str, optional): Custom filename (without extension)
    
    Returns:
        Dict: Result containing status, file path, and metadata
    """
    for attempt in range(max_retries + 1):
        try:
            if attempt > 0:
                logger.info(f"Retry attempt {attempt}/{max_retries} for bot {bot_id}")
                time.sleep(2 ** attempt)  # Exponential backoff
            
            result = download_video_from_s3(s3_url, bot_id, custom_filename)
            
            if result["status"] == "success":
                return result
            elif attempt == max_retries:
                return result
                
        except Exception as e:
            if attempt == max_retries:
                logger.error(f"All retry attempts failed for bot {bot_id}: {e}")
                return {
                    "status": "error",
                    "bot_id": bot_id,
                    "error": str(e),
                    "message": f"All retry attempts failed: {str(e)}"
                }
    
    return {
        "status": "error",
        "bot_id": bot_id,
        "error": "Max retries exceeded",
        "message": "Maximum retry attempts exceeded"
    }

def list_downloaded_videos() -> Dict:
    """
    List all downloaded videos in the Facial-Emotion-Recognition directory
    
    Returns:
        Dict: List of video files with metadata
    """
    try:
        project_root = os.path.dirname(os.path.dirname(__file__))
        target_dir = os.path.join(project_root, 'Facial-Emotion-Recognition-using-OpenCV-and-Deepface')
        
        if not os.path.exists(target_dir):
            return {
                "status": "success",
                "videos": [],
                "message": "Directory does not exist"
            }
        
        video_files = []
        for filename in os.listdir(target_dir):
            if filename.endswith('.mp4'):
                file_path = os.path.join(target_dir, filename)
                file_stats = os.stat(file_path)
                
                video_files.append({
                    "filename": filename,
                    "file_path": file_path,
                    "file_size": file_stats.st_size,
                    "created_at": datetime.fromtimestamp(file_stats.st_ctime).isoformat(),
                    "modified_at": datetime.fromtimestamp(file_stats.st_mtime).isoformat()
                })
        
        # Sort by creation time (newest first)
        video_files.sort(key=lambda x: x["created_at"], reverse=True)
        
        return {
            "status": "success",
            "videos": video_files,
            "total_videos": len(video_files),
            "message": f"Found {len(video_files)} video files"
        }
        
    except Exception as e:
        logger.error(f"Error listing videos: {e}")
        return {
            "status": "error",
            "error": str(e),
            "message": f"Failed to list videos: {str(e)}"
        }
