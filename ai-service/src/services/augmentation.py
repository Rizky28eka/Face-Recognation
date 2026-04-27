"""
Augmentation Service
=====================
Augmentasi ringan khusus untuk dataset **primer**.
Teknik yang diimplementasikan:
  1. Rotasi kecil  (±15°)
  2. Brightness adjustment (terang/gelap)

Augmentasi TIDAK diterapkan ke dataset sekunder.

Fungsi utama:
  - augment_image()    → augment satu gambar → list gambar hasil
  - augment_dataset()  → augment seluruh pasangan (X, y)
"""

import logging
from typing import Tuple, List

import cv2
import numpy as np

logger = logging.getLogger(__name__)


class AugmentationService:
    """
    Memperbanyak data training primer dengan transformasi sederhana.

    Parameters
    ----------
    rotation_angles : list[float]
        Sudut rotasi yang akan diterapkan (derajat).
    brightness_factors : list[float]
        Faktor pengali brightness (< 1 = gelap, > 1 = terang).
    """

    def __init__(
        self,
        rotation_angles: List[float] = (-15.0, -7.5, 7.5, 15.0),
        brightness_factors: List[float] = (0.7, 1.3),
    ):
        self._angles = rotation_angles
        self._brightness = brightness_factors
        logger.info(
            "AugmentationService ready (angles=%s, brightness=%s).",
            rotation_angles, brightness_factors,
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def augment_image(self, image: np.ndarray) -> List[np.ndarray]:
        """
        Hasilkan semua varian augmentasi dari satu gambar grayscale.

        Parameters
        ----------
        image : np.ndarray
            Gambar grayscale berukuran tetap (hasil preprocessing).

        Returns
        -------
        list[np.ndarray]
            Daftar gambar hasil augmentasi (tidak termasuk gambar asli).
        """
        augmented: List[np.ndarray] = []

        for angle in self._angles:
            augmented.append(self._rotate(image, angle))

        for factor in self._brightness:
            augmented.append(self._adjust_brightness(image, factor))

        # Kombinasi rotasi + brightness
        for angle in self._angles[:2]:
            for factor in self._brightness:
                rot = self._rotate(image, angle)
                augmented.append(self._adjust_brightness(rot, factor))

        return augmented

    def augment_dataset(
        self,
        X: np.ndarray,
        y: List[str],
        image_shape: Tuple[int, int] = (100, 100),
    ) -> Tuple[np.ndarray, List[str]]:
        """
        Augment seluruh dataset dan gabungkan dengan data asli.

        Parameters
        ----------
        X : np.ndarray         shape=(N, D)  – vektor fitur (flatten)
        y : list[str]          – label
        image_shape : tuple    – ukuran gambar sebelum di-flatten

        Returns
        -------
        X_aug : np.ndarray     shape=(N + N_aug, D)
        y_aug : list[str]
        """
        X_aug = list(X)
        y_aug = list(y)

        for feat, label in zip(X, y):
            # Kembalikan vektor ke matriks 2D
            img = (feat * 255).astype(np.uint8).reshape(image_shape)
            variants = self.augment_image(img)
            for v in variants:
                # Flatten kembali
                v_feat = v.flatten().astype(np.float64) / 255.0
                X_aug.append(v_feat)
                y_aug.append(label)

        logger.info(
            "Augmentasi selesai: %d sampel asli → %d sampel total.",
            len(X), len(X_aug),
        )
        return np.array(X_aug), y_aug

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _rotate(self, image: np.ndarray, angle: float) -> np.ndarray:
        """Rotasi gambar di sekitar pusat dengan sudut tertentu."""
        h, w = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        return cv2.warpAffine(image, M, (w, h), borderMode=cv2.BORDER_REFLECT)

    def _adjust_brightness(self, image: np.ndarray, factor: float) -> np.ndarray:
        """Perbesar atau perkecil brightness dengan mengalikan nilai piksel."""
        adjusted = np.clip(image.astype(np.float64) * factor, 0, 255).astype(np.uint8)
        return adjusted
