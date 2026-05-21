import cv2
import numpy as np
from src.utils.config import settings

class PreprocessingService:
    def __init__(self):
        self.target_size = (settings.RESIZE_WIDTH, settings.RESIZE_HEIGHT)
        # CLAHE for local contrast normalization — greatly improves LBPH
        # on faces with varying lighting/exposure across photos
        self.clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))

    def process(self, face_image: np.ndarray):
        """
        Grayscale → CLAHE equalization → resize.
        CLAHE normalizes local contrast so LBPH features stay consistent
        regardless of lighting differences between photos.
        """
        if len(face_image.shape) == 3:
            gray = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
        else:
            gray = face_image.copy()

        equalized = self.clahe.apply(gray)
        resized = cv2.resize(equalized, self.target_size)
        return resized
