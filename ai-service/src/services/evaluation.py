"""
Evaluation Service
==================
Melakukan evaluasi performa model menggunakan dataset primer atau sekunder.
Menghitung akurasi dan secara opsional menampilkan classification report.
"""

import logging
from typing import Dict, Any

from sklearn.metrics import accuracy_score, classification_report

from services.dataset_loader import DatasetLoaderService
from services.knn_model import KNNModelService

logger = logging.getLogger(__name__)


class EvaluationService:
    def __init__(
        self,
        loader: DatasetLoaderService,
        model_service: KNNModelService,
    ):
        self._loader = loader
        self._model_service = model_service

    def evaluate(self, dataset_type: str) -> Dict[str, Any]:
        """
        Evaluasi performa model saat ini terhadap dataset pilihan.

        Parameters
        ----------
        dataset_type : str
            "primary" atau "secondary"
        """
        logger.info("Memulai evaluasi model menggunakan dataset: %s", dataset_type)

        if not self._model_service.is_loaded():
            raise RuntimeError("Model belum dilatih atau dimuat.")

        # Load dataset
        X, y, meta = self._loader.load_dataset(dataset_type)
        if not X:
            raise ValueError(f"Dataset {dataset_type} kosong, tidak dapat dievaluasi.")

        # Prediksi batch
        y_pred = self._model_service._model.predict(X)

        # Hitung metrik
        accuracy = accuracy_score(y, y_pred)
        correct = sum(1 for true, pred in zip(y, y_pred) if true == pred)
        report = classification_report(y, y_pred, zero_division=0)

        logger.info(
            "Evaluasi %s selesai. Akurasi: %.2f%% (%d/%d benar)",
            dataset_type, accuracy * 100, correct, len(y)
        )

        return {
            "accuracy": float(accuracy),
            "dataset_used": dataset_type,
            "total_samples": len(y),
            "correct_predictions": correct,
            "report": report,
        }
