"""
Training Service
================
Menghandle pipeline training menggunakan dataset primer, sekunder, atau gabungan.
Jika dataset primer, dapat ditambahkan augmentasi gambar.
"""

import logging
from typing import Dict, Any, List
import numpy as np

from services.dataset_loader import DatasetLoaderService
from services.augmentation import AugmentationService
from services.knn_model import KNNModelService

logger = logging.getLogger(__name__)


class TrainingService:
    def __init__(
        self,
        loader: DatasetLoaderService,
        augmentation: AugmentationService,
        model_service: KNNModelService,
    ):
        self._loader = loader
        self._augmentation = augmentation
        self._model_service = model_service

    def train(self, dataset_type: str, use_augmentation: bool = False) -> Dict[str, Any]:
        """
        Latih model. Jika menggunakan primary atau combined, simpan model untuk runtime prediksi.
        """
        logger.info("Memulai proses training (tipe: %s, augmentasi: %s)", dataset_type, use_augmentation)

        X, y = [], []
        meta_info = {}

        if dataset_type in ["primary", "combined"]:
            X_prim, y_prim, meta_prim = self._loader.load_dataset("primary")
            if use_augmentation:
                logger.info("Menerapkan augmentasi pada dataset primer...")
                X_prim, y_prim = self._augmentation.augment_dataset(X_prim, y_prim)
                meta_prim["augmented_samples"] = len(X_prim)
            X.extend(X_prim)
            y.extend(y_prim)
            meta_info["primary"] = meta_prim

        if dataset_type in ["secondary", "combined"]:
            X_sec, y_sec, meta_sec = self._loader.load_dataset("secondary")
            X.extend(X_sec)
            y.extend(y_sec)
            meta_info["secondary"] = meta_sec

        if not X:
            raise ValueError(f"Dataset kosong untuk tipe: {dataset_type}")

        X_arr = np.array(X)
        self._model_service.train(X_arr, y)
        
        # Simpan model jika training melibatkan dataset primary (karena digunakan untuk run-time prediksi)
        # Jika hanya secondary, kita latih saja untuk keperluan evaluasi atau uji coba sementara
        model_path = "Memory only (not saved)"
        if dataset_type in ["primary", "combined"]:
            model_path = self._model_service.save_model()

        return {
            "message": "training completed",
            "dataset_used": dataset_type,
            "total_samples": len(X_arr),
            "total_classes": len(set(y)),
            "model_path": model_path,
        }
