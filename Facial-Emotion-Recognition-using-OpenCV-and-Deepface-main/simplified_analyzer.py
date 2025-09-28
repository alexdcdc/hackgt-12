#!/usr/bin/env python3
"""
Simplified Meeting Analyzer - 3 States Only
States: Engaged, Disengaged, Confused
"""

import cv2
import numpy as np
from deepface import DeepFace
import mediapipe as mp
from collections import defaultdict, deque
import time
import json

class SimplifiedAnalyzer:
    def __init__(self, video_source: str = None, output_file: str = "simplified_analysis.json"):
        """
        Initialize the simplified analyzer with 3 states only
        
        Args:
            video_source: Path to MP4 file or 0 for webcam
            output_file: Path to save analysis results
        """
        self.video_source = video_source or 0
        self.output_file = output_file
        
        # Initialize MediaPipe Face Mesh for engagement metrics
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=5,
            refine_landmarks=False,
            min_detection_confidence=0.4,
            min_tracking_confidence=0.4
        )
        
        # Face tracking and analysis storage
        self.face_tracks = {}  # Track faces across frames
        self.analysis_data = []  # Store time-series data
        self.frame_count = 0
        self.start_time = time.time()
        
        # Performance optimization
        self.emotion_analysis_interval = 3  # Analyze emotions every 3 frames
        self.last_emotion_analysis = {}  # Cache last emotion results
        
        # Simplified thresholds for 3 states
        self.confusion_threshold = 0.4
        self.disengagement_threshold = 0.4
        self.engagement_threshold = 0.5
        
        # Model configuration
        self.detector_backend = "opencv"  # Fast detector
        
        print(f"Using detector backend: {self.detector_backend}")
        print("Simplified analyzer: Engaged, Disengaged, Confused")
        
    def calculate_eye_aspect_ratio(self, landmarks, eye_indices):
        """Calculate Eye Aspect Ratio for blink detection"""
        eye_points = np.array([[landmarks[i].x, landmarks[i].y] for i in eye_indices])
        
        # Calculate distances
        vertical_1 = np.linalg.norm(eye_points[1] - eye_points[5])
        vertical_2 = np.linalg.norm(eye_points[2] - eye_points[4])
        horizontal = np.linalg.norm(eye_points[0] - eye_points[3])
        
        ear = (vertical_1 + vertical_2) / (2.0 * horizontal)
        return ear
    
    def calculate_gaze_direction(self, landmarks):
        """Calculate gaze direction from eye landmarks"""
        # Simplified gaze calculation
        left_eye_center = np.mean([
            [landmarks[33].x, landmarks[33].y],
            [landmarks[7].x, landmarks[7].y]
        ], axis=0)
        
        right_eye_center = np.mean([
            [landmarks[362].x, landmarks[362].y],
            [landmarks[382].x, landmarks[382].y]
        ], axis=0)
        
        # Calculate gaze vector
        gaze_vector = right_eye_center - left_eye_center
        return gaze_vector
    
    def calculate_head_pose(self, landmarks):
        """Calculate head pose from facial landmarks"""
        # Simplified head pose calculation
        nose_tip = [landmarks[1].x, landmarks[1].y]
        chin = [landmarks[152].x, landmarks[152].y]
        
        # Calculate head tilt
        head_vector = np.array(chin) - np.array(nose_tip)
        head_tilt = np.arctan2(head_vector[1], head_vector[0])
        
        return head_tilt
    
    def detect_confusion(self, emotions: dict, engagement_metrics: dict) -> float:
        """
        Detect confusion based on your requirements:
        - Combination of angry, disgust, fear
        - Head tilting
        """
        confusion_score = 0.0
        
        # Emotion-based confusion indicators (angry, disgust, fear)
        if emotions.get('angry', 0) > 0.3:
            confusion_score += 0.4
        if emotions.get('disgust', 0) > 0.2:
            confusion_score += 0.3
        if emotions.get('fear', 0) > 0.2:
            confusion_score += 0.3
        
        # Head tilting indicates confusion
        if engagement_metrics.get('head_tilt', 0) > 0.3:  # Significant head tilt
            confusion_score += 0.4
        
        # Additional confusion indicators
        if emotions.get('sad', 0) > 0.3:  # Sadness can indicate confusion
            confusion_score += 0.2
            
        return min(confusion_score, 1.0)
    
    def detect_disengagement(self, emotions: dict, engagement_metrics: dict) -> float:
        """
        Detect disengagement based on your requirements:
        - Gaze off screen
        - Other disengagement factors
        """
        disengagement_score = 0.0
        
        # Gaze off screen is primary disengagement indicator
        if engagement_metrics.get('gaze_off_screen', False):
            disengagement_score += 0.5
        
        # Other disengagement factors
        if emotions.get('neutral', 0) > 0.8:  # Very high neutral indicates disengagement
            disengagement_score += 0.3
        if emotions.get('sad', 0) > 0.2:  # Low-level sadness
            disengagement_score += 0.2
        if emotions.get('happy', 0) < 0.1:  # Very low happiness
            disengagement_score += 0.2
        if engagement_metrics.get('eye_aspect_ratio', 0) < 0.15:  # Eyes half-closed
            disengagement_score += 0.3
        if engagement_metrics.get('head_tilt', 0) > 0.2:  # Looking away
            disengagement_score += 0.2
            
        return min(disengagement_score, 1.0)
    
    def detect_engagement(self, emotions: dict, engagement_metrics: dict) -> float:
        """
        Detect engagement based on your requirements:
        - Looking at camera normally (neutral is good)
        - Forward gaze
        - Alert eyes
        """
        engagement_score = 0.0
        
        # Neutral emotion is good for engagement (as you specified)
        if 0.3 < emotions.get('neutral', 0) < 0.7:  # Moderate neutral is engaged
            engagement_score += 0.4
        if emotions.get('happy', 0) > 0.2:  # Some happiness
            engagement_score += 0.3
        if emotions.get('surprise', 0) > 0.1:  # Some interest/surprise
            engagement_score += 0.2
        
        # Looking at camera normally (forward gaze)
        if not engagement_metrics.get('gaze_off_screen', False):
            engagement_score += 0.4
        if engagement_metrics.get('head_tilt', 0) < 0.2:  # Looking forward
            engagement_score += 0.3
        if engagement_metrics.get('eye_aspect_ratio', 0) > 0.2:  # Eyes open and alert
            engagement_score += 0.3
        
        # Low negative emotions
        if emotions.get('angry', 0) < 0.2:  # Low anger
            engagement_score += 0.1
        if emotions.get('sad', 0) < 0.2:  # Low sadness
            engagement_score += 0.1
            
        return max(0.0, min(engagement_score, 1.0))
    
    def get_dominant_state(self, confusion: float, disengagement: float, engagement: float) -> tuple:
        """
        Determine the dominant state from 3 options
        
        Args:
            confusion: Confusion score
            disengagement: Disengagement score
            engagement: Engagement score
            
        Returns:
            Tuple of (state_name, confidence)
        """
        states = {
            'confused': confusion,
            'disengaged': disengagement,
            'engaged': engagement
        }
        
        # Find the state with highest score
        dominant_state = max(states, key=states.get)
        confidence = states[dominant_state]
        
        # Apply thresholds
        if confidence < 0.2:  # If no state is strong enough, default to engaged
            return 'engaged', 0.5
        
        return dominant_state, confidence
    
    def track_face(self, face_bbox: tuple, face_id: int = None) -> int:
        """Track face across frames with simplified spatial continuity"""
        if face_id is not None and face_id in self.face_tracks:
            # Update existing track
            self.face_tracks[face_id]['bbox'] = face_bbox
            self.face_tracks[face_id]['last_seen'] = self.frame_count
            return face_id
        
        # Find closest existing track
        best_match = None
        best_distance = float('inf')
        
        for track_id, track_data in self.face_tracks.items():
            if self.frame_count - track_data['last_seen'] > 5:
                continue
                
            # Calculate distance between centers
            old_center = (track_data['bbox'][0] + track_data['bbox'][2]//2, 
                         track_data['bbox'][1] + track_data['bbox'][3]//2)
            new_center = (face_bbox[0] + face_bbox[2]//2, 
                         face_bbox[1] + face_bbox[3]//2)
            
            distance = np.sqrt((old_center[0] - new_center[0])**2 + 
                             (old_center[1] - new_center[1])**2)
            
            if distance < best_distance and distance < 80:
                best_distance = distance
                best_match = track_id
        
        if best_match is not None:
            # Update existing track
            self.face_tracks[best_match]['bbox'] = face_bbox
            self.face_tracks[best_match]['last_seen'] = self.frame_count
            return best_match
        else:
            # Create new track
            new_id = max(self.face_tracks.keys(), default=-1) + 1
            self.face_tracks[new_id] = {
                'bbox': face_bbox,
                'last_seen': self.frame_count,
                'emotion_history': deque(maxlen=10),
                'engagement_history': deque(maxlen=10)
            }
            return new_id
    
    def analyze_frame(self, frame: np.ndarray) -> dict:
        """Analyze a single frame with simplified 3-state detection"""
        results = {
            'timestamp': time.time() - self.start_time,
            'frame_count': self.frame_count,
            'faces': [],
            'summary': {
                'total_faces': 0,
                'engaged_count': 0,
                'disengaged_count': 0,
                'confused_count': 0
            }
        }
        
        # Convert BGR to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process with MediaPipe Face Mesh
        face_mesh_results = self.face_mesh.process(rgb_frame)
        
        if face_mesh_results.multi_face_landmarks:
            results['summary']['total_faces'] = len(face_mesh_results.multi_face_landmarks)
            
            for face_landmarks in face_mesh_results.multi_face_landmarks:
                # Calculate engagement metrics
                left_ear = self.calculate_eye_aspect_ratio(face_landmarks.landmark, 
                                                         [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246])
                right_ear = self.calculate_eye_aspect_ratio(face_landmarks.landmark, 
                                                          [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398])
                
                gaze_vector = self.calculate_gaze_direction(face_landmarks.landmark)
                head_tilt = self.calculate_head_pose(face_landmarks.landmark)
                
                # Determine if gaze is off-screen
                gaze_off_screen = abs(gaze_vector[0]) > 0.25 or abs(gaze_vector[1]) > 0.25
                
                # Calculate blink rate
                avg_ear = (left_ear + right_ear) / 2
                blink_rate = 1.0 if avg_ear < 0.2 else 0.0
                
                engagement_metrics = {
                    'eye_aspect_ratio': float(avg_ear),
                    'gaze_off_screen': bool(gaze_off_screen),
                    'head_tilt': float(abs(head_tilt)),
                    'blink_rate': float(blink_rate)
                }
                
                # Get face bounding box from landmarks
                x_coords = [lm.x for lm in face_landmarks.landmark]
                y_coords = [lm.y for lm in face_landmarks.landmark]
                x_min, x_max = int(min(x_coords) * frame.shape[1]), int(max(x_coords) * frame.shape[1])
                y_min, y_max = int(min(y_coords) * frame.shape[0]), int(max(y_coords) * frame.shape[0])
                
                face_bbox = (x_min, y_min, x_max - x_min, y_max - y_min)
                face_id = self.track_face(face_bbox)
                
                # Extract face ROI for emotion analysis
                face_roi = frame[y_min:y_max, x_min:x_max]
                if face_roi.size > 0:
                    # Only analyze emotions every few frames for performance
                    should_analyze_emotions = (
                        self.frame_count % self.emotion_analysis_interval == 0 or
                        face_id not in self.last_emotion_analysis
                    )
                    
                    if should_analyze_emotions:
                        try:
                            # Analyze emotions with DeepFace
                            emotion_result = DeepFace.analyze(
                                face_roi, 
                                actions=['emotion'], 
                                enforce_detection=False,
                                silent=True,
                                detector_backend=self.detector_backend
                            )
                            
                            emotions = emotion_result[0]['emotion']
                            dominant_emotion = max(emotions, key=emotions.get)
                            
                            # Cache the result
                            self.last_emotion_analysis[face_id] = {
                                'emotions': emotions,
                                'dominant_emotion': dominant_emotion
                            }
                            
                        except Exception as e:
                            print(f"Emotion analysis error for face {face_id}: {e}")
                            # Use default emotions if analysis fails
                            emotions = {'neutral': 1.0, 'happy': 0.0, 'sad': 0.0, 'angry': 0.0, 'fear': 0.0, 'disgust': 0.0, 'surprise': 0.0}
                            dominant_emotion = 'neutral'
                            self.last_emotion_analysis[face_id] = {
                                'emotions': emotions,
                                'dominant_emotion': dominant_emotion
                            }
                    else:
                        # Use cached emotion results
                        cached = self.last_emotion_analysis.get(face_id, {
                            'emotions': {'neutral': 1.0, 'happy': 0.0, 'sad': 0.0, 'angry': 0.0, 'fear': 0.0, 'disgust': 0.0, 'surprise': 0.0},
                            'dominant_emotion': 'neutral'
                        })
                        emotions = cached['emotions']
                        dominant_emotion = cached['dominant_emotion']
                    
                    # Calculate all 3 states
                    confusion_score = self.detect_confusion(emotions, engagement_metrics)
                    disengagement_score = self.detect_disengagement(emotions, engagement_metrics)
                    engagement_score = self.detect_engagement(emotions, engagement_metrics)
                    
                    # Get dominant state
                    dominant_state, confidence = self.get_dominant_state(
                        confusion_score, disengagement_score, engagement_score
                    )
                    
                    # Update summary
                    if dominant_state == 'engaged':
                        results['summary']['engaged_count'] += 1
                    elif dominant_state == 'disengaged':
                        results['summary']['disengaged_count'] += 1
                    elif dominant_state == 'confused':
                        results['summary']['confused_count'] += 1
                    
                    # Store in face track
                    if face_id in self.face_tracks:
                        self.face_tracks[face_id]['emotion_history'].append(emotions)
                        self.face_tracks[face_id]['engagement_history'].append(engagement_score)
                    
                    face_result = {
                        'face_id': int(face_id),
                        'bbox': [int(x) for x in face_bbox],
                        'emotions': {k: float(v) for k, v in emotions.items()},
                        'dominant_emotion': str(dominant_emotion),
                        'confusion_score': float(confusion_score),
                        'disengagement_score': float(disengagement_score),
                        'engagement_score': float(engagement_score),
                        'dominant_state': str(dominant_state),
                        'state_confidence': float(confidence),
                        'engagement_metrics': engagement_metrics
                    }
                    
                    results['faces'].append(face_result)
        
        # Store analysis data
        self.analysis_data.append(results)
        
        return results
    
    def draw_analysis(self, frame: np.ndarray, analysis: dict) -> np.ndarray:
        """Draw analysis results on frame with simplified 3-state color coding"""
        # Draw summary
        summary = analysis['summary']
        summary_text = f"Total: {summary['total_faces']} | Engaged: {summary['engaged_count']} | Disengaged: {summary['disengaged_count']} | Confused: {summary['confused_count']}"
        cv2.putText(frame, summary_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Draw individual face analysis
        for face in analysis['faces']:
            x, y, w, h = face['bbox']
            face_id = face['face_id']
            dominant_state = face['dominant_state']
            confidence = face['state_confidence']
            
            # Simplified color coding for 3 states
            if dominant_state == 'confused':
                color = (0, 0, 255)  # Red for confused
                status = "CONFUSED"
            elif dominant_state == 'disengaged':
                color = (0, 165, 255)  # Orange for disengaged
                status = "DISENGAGED"
            else:  # engaged
                color = (0, 255, 0)  # Green for engaged
                status = "ENGAGED"
            
            # Draw bounding box
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            
            # Draw labels
            label = f"Person {face_id}: {status}"
            cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            
            # Draw scores
            scores_text = f"C:{face['confusion_score']:.2f} D:{face['disengagement_score']:.2f} E:{face['engagement_score']:.2f}"
            cv2.putText(frame, scores_text, (x, y + h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.4, color, 1)
        
        return frame
    
    def run_analysis(self, save_video: bool = False, output_video: str = "simplified_analysis_output.mp4"):
        """Run the simplified analysis"""
        cap = cv2.VideoCapture(self.video_source)
        
        if not cap.isOpened():
            print(f"Error: Could not open video source {self.video_source}")
            return
        
        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        print(f"Video properties: {width}x{height} @ {fps}fps")
        print(f"Using detector backend: {self.detector_backend}")
        print("Simplified analyzer: Engaged, Disengaged, Confused")
        
        # Setup video writer if saving
        if save_video:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_video, fourcc, fps, (width, height))
        
        print("Starting simplified analysis...")
        print("Press 'q' to quit, 's' to save current analysis")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Analyze frame
            analysis = self.analyze_frame(frame)
            
            # Draw analysis on frame
            frame_with_analysis = self.draw_analysis(frame, analysis)
            
            # Display frame
            cv2.imshow('Simplified Analysis', frame_with_analysis)
            
            # Save frame if requested
            if save_video:
                out.write(frame_with_analysis)
            
            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('s'):
                self.save_analysis()
                print("Analysis saved!")
            
            self.frame_count += 1
        
        # Cleanup
        cap.release()
        if save_video:
            out.release()
        cv2.destroyAllWindows()
        
        # Save final analysis
        self.save_analysis()
        print(f"Simplified analysis complete! Results saved to {self.output_file}")
    
    def save_analysis(self):
        """Save analysis results to JSON file"""
        with open(self.output_file, 'w') as f:
            json.dump(self.analysis_data, f, indent=2)

def main():
    """Main function to run the simplified analyzer"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Simplified Meeting Engagement Analyzer - 3 States')
    parser.add_argument('--video', type=str, help='Path to video file (default: webcam)')
    parser.add_argument('--output', type=str, default='simplified_analysis.json', help='Output JSON file')
    parser.add_argument('--save-video', action='store_true', help='Save analyzed video')
    parser.add_argument('--output-video', type=str, default='simplified_analysis_output.mp4', help='Output video file')
    parser.add_argument('--detector', type=str, default='opencv', choices=['opencv', 'mtcnn'], help='Face detector backend')
    
    args = parser.parse_args()
    
    # Initialize analyzer
    analyzer = SimplifiedAnalyzer(
        video_source=args.video,
        output_file=args.output
    )
    
    # Override detector if specified
    analyzer.detector_backend = args.detector
    
    # Run analysis
    analyzer.run_analysis(
        save_video=args.save_video,
        output_video=args.output_video
    )

if __name__ == "__main__":
    main()
