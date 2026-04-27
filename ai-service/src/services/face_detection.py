import cv2
import numpy as np
import os
from src.utils.config import settings

class FaceDetectionService:
    def __init__(self):
        # Use path from config
        cascade_path = settings.CASCADE_PATH
        
        if os.path.exists(cascade_path):
            self.face_cascade = cv2.CascadeClassifier(cascade_path)
        else:
            # Fallback to OpenCV internal data if local file not found
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        self.profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

    def detect_faces(self, image: np.ndarray):
        """
        Detect faces in an image using Haar Cascade.
        Returns a list of bounding boxes (x, y, w, h).
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # 1. Try frontal face detection
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        # 2. Try profile face detection (for Left/Right liveness movements)
        if len(faces) == 0:
            faces = self.profile_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            
            # Profile cascade usually detects faces looking to the right. Flip image to detect looking to the left.
            if len(faces) == 0:
                flipped_gray = cv2.flip(gray, 1)
                faces_flipped = self.profile_cascade.detectMultiScale(flipped_gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
                if len(faces_flipped) > 0:
                    x, y, w, h = faces_flipped[0]
                    # Map coordinates back to original image
                    faces = [[gray.shape[1] - x - w, y, w, h]]

        # 3. Last resort: Aggressive frontal detection (lower minNeighbors for tricky angles like Up/Smile)
        if len(faces) == 0:
            faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(30, 30))

        return faces

    def crop_face(self, image: np.ndarray, box):
        """
        Crop the face area from the image based on the bounding box.
        """
        x, y, w, h = box
        return image[y:y+h, x:x+w]
