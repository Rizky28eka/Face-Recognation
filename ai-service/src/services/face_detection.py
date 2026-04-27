"""
Face Detection Service
========================
Deteksi wajah menggunakan Haar Cascade Classifier dari OpenCV.

Fungsi utama:
  - detect()            → kembalikan list bounding box
  - crop_face()         → crop satu wajah dari bounding box
  - detect_and_crop()   → deteksi + crop sekaligus
"""

import logging
from pathlib import Path
from typing import List, Tuple, Optional

import cv2
import numpy as np

logger = logging.getLogger(__name__)

BBox = Tuple[int, int, int, int]  # (x, y, w, h)


class FaceDetectionService:
    """
    Wrapper di atas OpenCV CascadeClassifier untuk deteksi wajah frontal.

    Parameters
    ----------
    cascade_path : str | None
        Path ke file XML Haar Cascade. Default: haarcascade_frontalface_default.xml
    scale_factor : float
        ScaleFactor untuk detectMultiScale (default 1.1).
    min_neighbors : int
        MinNeighbors untuk detectMultiScale (default 5).
    min_size : tuple[int, int]
        Ukuran minimum wajah dalam piksel (default 30×30).
    """

    def __init__(
        self,
        cascade_path: Optional[str] = None,
        scale_factor: float = 1.1,
        min_neighbors: int = 5,
        min_size: Tuple[int, int] = (30, 30),
    ):
        if cascade_path is None:
            cascade_path = str(
                Path(cv2.__file__).parent / "data" / "haarcascade_frontalface_default.xml"
            )

        self._clf = cv2.CascadeClassifier(cascade_path)
        if self._clf.empty():
            raise RuntimeError(f"Gagal memuat Haar Cascade: {cascade_path}")

        self._scale_factor = scale_factor
        self._min_neighbors = min_neighbors
        self._min_size = min_size
        logger.info("FaceDetectionService ready (Haar Cascade loaded).")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def detect(self, image: np.ndarray) -> List[BBox]:
        """
        Deteksi semua wajah dalam gambar BGR.

        Returns
        -------
        list[BBox]  – list of (x, y, w, h)
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
        faces = self._clf.detectMultiScale(
            gray,
            scaleFactor=self._scale_factor,
            minNeighbors=self._min_neighbors,
            minSize=self._min_size,
        )
        return [] if len(faces) == 0 else [tuple(f) for f in faces]  # type: ignore

    def crop_face(self, image: np.ndarray, bbox: BBox) -> np.ndarray:
        """Crop ROI wajah dari gambar berdasarkan bounding box."""
        x, y, w, h = bbox
        return image[y: y + h, x: x + w]

    def detect_and_crop(self, image: np.ndarray) -> Tuple[List[np.ndarray], List[BBox]]:
        """
        Deteksi + crop semua wajah sekaligus.

        Returns
        -------
        (crops, bboxes) – dua list dengan panjang sama
        """
        bboxes = self.detect(image)
        crops = [self.crop_face(image, b) for b in bboxes]
        return crops, bboxes
