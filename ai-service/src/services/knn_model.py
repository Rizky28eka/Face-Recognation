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
        distances, _ = self.model.kneighbors(X)
        avg_distance = np.mean(distances)
        confidence = 1 / (1 + avg_distance)
        
        return label, float(confidence)

    def is_model_available(self):
        return self.model is not None
