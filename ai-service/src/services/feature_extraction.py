"""
Feature Extraction Service
===========================
Mengubah matriks gambar 2D menjadi vektor fitur 1D (flatten + normalisasi).

Metode ini dipilih karena:
  - Sederhana dan mudah dijelaskan secara akademis
  - Kompatibel langsung dengan KNN dari scikit-learn
  - Tidak memerlukan deep learning

Fungsi:
  - extract()        → satu gambar → vektor 1D
  - extract_batch()  → list gambar → matriks (N, D)
"""

import logging
import numpy as np

logger = logging.getLogger(__name__)


class FeatureExtractionService:
    """
    Ekstraksi fitur berbasis flatten piksel.

    Gambar grayscale (H × W) → vektor (H*W,) ternormalisasi ke [0.0, 1.0].
    """

    def __init__(self):
        logger.info("FeatureExtractionService ready (method: flatten + normalize).")

    def extract(self, processed_image: np.ndarray) -> np.ndarray:
        """
        Ubah gambar preprocessed menjadi vektor fitur 1D.

        Parameters
        ----------
        processed_image : np.ndarray
            Gambar grayscale berukuran tetap (mis. 100×100).

        Returns
        -------
        np.ndarray – shape=(H*W,), dtype=float64, nilai ∈ [0.0, 1.0]
        """
        if processed_image is None or processed_image.size == 0:
            raise ValueError("Input gambar kosong atau None.")
        flat = processed_image.flatten().astype(np.float64) / 255.0
        return flat

    def extract_batch(self, images: list) -> np.ndarray:
        """
        Ekstrak fitur untuk sekumpulan gambar sekaligus.

        Parameters
        ----------
        images : list[np.ndarray]

        Returns
        -------
        np.ndarray – shape=(N, H*W)
        """
        return np.array([self.extract(img) for img in images])
