import numpy as np

class FeatureExtractionService:
    def extract(self, preprocessed_image: np.ndarray):
        """
        Extract features by flattening the image into a 1D vector.
        """
        return preprocessed_image.flatten()
