import cv2
import numpy as np
from src.utils.config import settings

class PreprocessingService:
    def __init__(self):
        self.target_size = (settings.RESIZE_WIDTH, settings.RESIZE_HEIGHT)

    def process(self, face_image: np.ndarray):
        """
        Convert to grayscale and resize to target size.
        """
        if len(face_image.shape) == 3:
            gray = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
        else:
            gray = face_image
            
        resized = cv2.resize(gray, self.target_size)
        return resized
