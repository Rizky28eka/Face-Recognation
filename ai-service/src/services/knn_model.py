import joblib
import os
import numpy as np
from src.utils.config import settings


class KNNModelService:
    def __init__(self):
        self.model_path        = settings.MODEL_PATH
        self.model             = None
        self.distance_threshold = None  # Ditetapkan saat load_model
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model        = joblib.load(self.model_path)
                self.distance_min = None
                self._compute_distance_threshold()
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None
        else:
            print(f"Model file not found at {self.model_path}")
            self.model = None

    def _compute_distance_threshold(self):
        """
        Hitung distance threshold dari training data.
        Threshold = mean + 2*std jarak antar tetangga di training set.
        Dipakai sebagai fallback confidence untuk single-class model.
        """
        if self.model is None:
            return

        try:
            X_train = self.model._fit_X
            k_probe = min(2, len(X_train))
            distances, _ = self.model.kneighbors(X_train, n_neighbors=k_probe)
            neighbor_distances = distances[:, -1]
            mean_d = float(np.mean(neighbor_distances))
            std_d  = float(np.std(neighbor_distances))
            self.distance_threshold = max(mean_d + 2.0 * std_d, 1e-6)
            self.distance_min       = max(float(np.min(neighbor_distances)) * 0.9, 1e-6)
            print(f"[KNN] Distance threshold: {self.distance_threshold:.4f}  min: {self.distance_min:.4f}  (mean={mean_d:.4f} std={std_d:.4f})")
        except Exception as e:
            print(f"[KNN] Could not compute distance threshold: {e}")
            self.distance_threshold = None
            self.distance_min       = None

    def predict(self, feature_vector: np.ndarray):
        """
        Predict label dan confidence.

        Multi-class: confidence dari predict_proba (vote berbobot jarak).
        Single-class: confidence dari jarak euclidean ke tetangga terdekat
                      (dinormalisasi: 1.0 = sangat dekat, 0.0 = sangat jauh).
                      Ini mencegah FAR=100% pada model single-class.
        """
        if self.model is None:
            raise ValueError("Model not loaded. Please train the model first.")

        X                = feature_vector.reshape(1, -1)
        n_classes        = len(self.model.classes_)
        distances, indices = self.model.kneighbors(X)
        min_distance     = float(distances[0][0])
        avg_distance     = float(np.mean(distances))
        neighbor_labels  = [self.model.classes_[self.model._y[i]] for i in indices[0]]

        if n_classes == 1:
            label    = self.model.classes_[0]
            d_min    = self.distance_min or 0.0
            d_thresh = self.distance_threshold
            if d_thresh and d_thresh > d_min:
                # Normalisasi dari range [d_min, d_thresh] ke [1.0, 0.0]
                # dist ≤ d_min  → confidence 1.0 (sangat dekat)
                # dist = d_thresh → confidence 0.0 (batas penolakan)
                ratio      = (min_distance - d_min) / (d_thresh - d_min)
                confidence = float(max(0.0, 1.0 - ratio))
            else:
                confidence = float(max(0.0, 1.0 - min_distance / 10.0))
        else:
            # Multi-class: probabilistik vote berbobot jarak
            proba      = self.model.predict_proba(X)[0]
            confidence = float(np.max(proba))
            label      = self.model.classes_[int(np.argmax(proba))]

        print("\n" + "=" * 50)
        dist_thresh_str = f"{self.distance_threshold:.2f}" if self.distance_threshold else "N/A"
        print(f"[KNN] Label: {label}  Confidence: {confidence:.4f}  Dist: {min_distance:.2f}  DistThresh: {dist_thresh_str}")
        print("[KNN] Nearest Neighbors:")
        for i, (dist, lbl) in enumerate(zip(distances[0], neighbor_labels)):
            print(f"  {i+1}. {lbl}  dist={dist:.2f}")
        print("=" * 50 + "\n")

        return label, confidence, avg_distance

    def is_model_available(self):
        return self.model is not None
