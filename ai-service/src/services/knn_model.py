"""
KNN Model Service
=================
Menyimpan model ke disk, load ke memory, dan melakukan prediksi.
Hanya model dari dataset primer yang disimpan untuk runtime prediksi.
"""

import logging
from pathlib import Path
from typing import Any, Dict, Optional, List

import joblib
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

logger = logging.getLogger(__name__)

# Path default
DEFAULT_MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "knn_model.pkl"
CONFIDENCE_THRESHOLD = 0.5


class KNNModelService:
    def __init__(
        self,
        model_path: Path | str = DEFAULT_MODEL_PATH,
        n_neighbors: int = 5,
        metric: str = "euclidean",
    ):
        self._model_path = Path(model_path)
        self._n_neighbors = n_neighbors
        self._metric = metric
        self._model: Optional[KNeighborsClassifier] = None
        self._classes: List[str] = []

    def train(self, X: np.ndarray, y: List[str]) -> KNeighborsClassifier:
        """Latih model KNN baru."""
        n_neighbors = min(self._n_neighbors, len(X))
        clf = KNeighborsClassifier(
            n_neighbors=n_neighbors,
            metric=self._metric,
            weights="distance",
        )
        clf.fit(X, y)

        self._model = clf
        self._classes = list(dict.fromkeys(y))
        logger.info(
            "Model KNN dilatih dengan %d sampel, %d kelas, k=%d",
            len(X), len(self._classes), n_neighbors
        )
        return clf

    def save_model(self) -> str:
        """Simpan model ke file .pkl"""
        if self._model is None:
            raise RuntimeError("Model belum dilatih.")

        self._model_path.parent.mkdir(parents=True, exist_ok=True)
        payload = {"model": self._model, "classes": self._classes}
        joblib.dump(payload, self._model_path)
        logger.info("Model disimpan ke: %s", self._model_path)
        return str(self._model_path)

    def load_model(self) -> None:
        """Load model dari .pkl"""
        if not self._model_path.exists():
            raise FileNotFoundError(f"Model tidak ditemukan: {self._model_path}")

        payload = joblib.load(self._model_path)
        self._model = payload["model"]
        self._classes = payload.get("classes", [])
        logger.info("Model dimuat. Kelas yang tersedia: %s", self._classes)

    def is_loaded(self) -> bool:
        return self._model is not None

    def predict(self, features: np.ndarray) -> Dict[str, Any]:
        """Prediksi dengan confidence score."""
        if self._model is None:
            raise RuntimeError("Model belum dimuat.")

        X = features.reshape(1, -1)
        distances, _ = self._model.kneighbors(X)
        mean_distance = float(np.mean(distances))

        # Semakin kecil mean_distance, semakin besar confidence
        confidence = float(1.0 / (1.0 + mean_distance))
        confidence = round(min(max(confidence, 0.0), 1.0), 4)

        predicted_label: str = self._model.predict(X)[0]

        if confidence >= CONFIDENCE_THRESHOLD:
            return {
                "name": predicted_label,
                "confidence": confidence,
                "status": "recognized",
                "message": "Face recognized successfully",
            }
        else:
            return {
                "name": "unknown",
                "confidence": confidence,
                "status": "unrecognized",
                "message": "Confidence below threshold",
            }
