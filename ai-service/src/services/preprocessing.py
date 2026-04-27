"""
Preprocessing Service
======================
Mengubah crop wajah BGR menjadi gambar grayscale berukuran tetap.

Fungsi:
  - process()  →  grayscale + resize
"""

import logging
from typing import Tuple

import cv2
import numpy as np

logger = logging.getLogger(__name__)


class PreprocessingService:
    """
    Pipeline preprocessing sederhana: BGR → grayscale → resize.

    Parameters
    ----------
    target_size : tuple[int, int]
        (width, height) output – default (100, 100).
    """

    def __init__(self, target_size: Tuple[int, int] = (100, 100)):
        self.target_size = target_size
        logger.info("PreprocessingService ready (target=%s).", target_size)

    def process(self, face_crop: np.ndarray) -> np.ndarray:
        """
        Proses crop wajah.

        1. Konversi BGR → Grayscale
        2. Resize ke target_size

        Parameters
        ----------
        face_crop : np.ndarray
            Crop wajah (BGR atau grayscale).

        Returns
        -------
        np.ndarray – grayscale, shape=(H, W), dtype=uint8
        """
        # Grayscale
        if len(face_crop.shape) == 3:
            gray = cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY)
        else:
            gray = face_crop

        # Resize
        resized = cv2.resize(gray, self.target_size, interpolation=cv2.INTER_AREA)
        return resized
