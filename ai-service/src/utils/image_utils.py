"""
Image Utils
===========
Helper untuk memproses gambar dari Request API.
"""

import logging
from typing import Optional

import cv2
import numpy as np

logger = logging.getLogger(__name__)


def read_uploaded_image(raw_bytes: bytes) -> Optional[np.ndarray]:
    """Konversi bytes dari UploadFile menjadi numpy array format BGR."""
    try:
        np_arr = np.frombuffer(raw_bytes, dtype=np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if image is None:
            logger.error("Gagal mendecode gambar.")
        return image
    except Exception as exc:
        logger.error("Error reading image: %s", exc)
        return None
