import joblib
import os
import numpy as np
from src.utils.config import settings

class KNNModelService:
    def __init__(self):
        self.model_path = settings.MODEL_PATH
        self.model = None
        self.load_model()

    def load_model(self):
        """
        Load the KNN model from disk if it exists.
        """
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None
        else:
            print(f"Model file not found at {self.model_path}")

    def predict(self, feature_vector: np.ndarray):
        """
        Predict the label and return confidence score.
        """
        if self.model is None:
            raise ValueError("Model not loaded. Please train the model first.")

        X = feature_vector.reshape(1, -1)
        label = self.model.predict(X)[0]
        distances, indices = self.model.kneighbors(X)
        avg_distance = np.mean(distances)
        
        # Get labels of the nearest neighbors
        neighbor_labels = [self.model.classes_[self.model._y[i]] for i in indices[0]]
        
        # Use predict_proba for confidence based on neighbor majority
        proba = self.model.predict_proba(X)[0]
        confidence = float(np.max(proba))
        
        print("\n" + "="*50)
        print(f"[DEBUG KNN] Prediksi Utama -> Label: {label}, Confidence: {confidence:.4f}")
        print(f"[DEBUG KNN] Rata-rata Jarak (Avg Distance): {avg_distance:.2f}")
        print("[DEBUG KNN] Detail Tetangga Terdekat (Nearest Neighbors):")
        for i, (dist, lbl) in enumerate(zip(distances[0], neighbor_labels)):
            print(f"  -> Tetangga {i+1}: Label = {lbl}, Jarak = {dist:.2f}")
        
        # Solusi sementara: Jika jarak rata-rata terlalu jauh (> 3000), wajah sebenarnya tidak dikenali.
        # Kita bisa turunkan confidence secara paksa jika mau, tapi saat ini kita biarkan untuk di-debug.
        if avg_distance > 3000:
            print("[DEBUG KNN] ⚠️ PERINGATAN: Jarak terlalu jauh! Ini kemungkinan besar orang yang salah/tidak dikenal.")
        print("="*50 + "\n")
        
        return label, float(confidence), float(avg_distance)

    def is_model_available(self):
        return self.model is not None
