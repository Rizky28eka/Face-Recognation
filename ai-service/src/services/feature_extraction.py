import numpy as np
from skimage.feature import local_binary_pattern

# LBPH parameters — 8×8 grid, R=1 → 640-dim vector
LBP_P      = 8
LBP_R      = 1
LBP_METHOD = 'uniform'
GRID_X     = 8
GRID_Y     = 8

class FeatureExtractionService:
    def extract(self, preprocessed_image: np.ndarray) -> np.ndarray:
        """
        LBPH on 8×8 grid with CLAHE-preprocessed input.
        640-dim feature vector: 64 blocks × (P+2=10) bins each.
        """
        h, w = preprocessed_image.shape
        lbp     = local_binary_pattern(preprocessed_image, LBP_P, LBP_R, method=LBP_METHOD)
        n_bins  = LBP_P + 2
        block_h = h // GRID_Y
        block_w = w // GRID_X
        histograms = []

        for row in range(GRID_Y):
            for col in range(GRID_X):
                block = lbp[row * block_h:(row + 1) * block_h,
                             col * block_w:(col + 1) * block_w]
                hist, _ = np.histogram(block.ravel(), bins=n_bins,
                                       range=(0, n_bins), density=True)
                histograms.append(hist)

        return np.concatenate(histograms)
