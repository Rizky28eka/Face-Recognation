"""
Dataset Loader Service
=======================
Membaca dataset wajah dari folder (primer atau sekunder)
dan mengembalikan pasangan (X_features, y_labels).

Struktur folder yang diharapkan:
    dataset/
    ├── primary/
    │   ├── user_1/
    │   │   ├── foto1.jpg
    │   │   └── foto2.jpg
    │   └── user_2/
    │       └── ...
    └── secondary/
        ├── person_1/
        └── person_2/

Fungsi utama:
  - load_dataset(dataset_type)  →  (X, y, meta)
"""

import logging
from pathlib import Path
from typing import Tuple, List, Dict, Any, Literal

import cv2
import numpy as np

from services.face_detection import FaceDetectionService
from services.preprocessing import PreprocessingService
from services.feature_extraction import FeatureExtractionService

logger = logging.getLogger(__name__)

# Ekstensi gambar yang didukung
ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".bmp", ".pgm"}

# Path root dataset (relatif dari project root)
DATASET_ROOT = Path(__file__).resolve().parents[2] / "dataset"

DatasetType = Literal["primary", "secondary"]


class DatasetLoaderService:
    """
    Loader yang membaca folder dataset, mendeteksi wajah,
    melakukan preprocessing, dan mengekstrak fitur.

    Parameters
    ----------
    face_detector    : FaceDetectionService
    preprocessor     : PreprocessingService
    feature_extractor: FeatureExtractionService
    dataset_root     : Path | None  – override path root dataset
    """

    def __init__(
        self,
        face_detector: FaceDetectionService,
        preprocessor: PreprocessingService,
        feature_extractor: FeatureExtractionService,
        dataset_root: Path | None = None,
    ):
        self._detector = face_detector
        self._preprocessor = preprocessor
        self._extractor = feature_extractor
        self._root = dataset_root or DATASET_ROOT

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def load_dataset(
        self,
        dataset_type: DatasetType,
    ) -> Tuple[np.ndarray, List[str], Dict[str, Any]]:
        """
        Baca dataset dari folder dan kembalikan fitur + label.

        Parameters
        ----------
        dataset_type : "primary" | "secondary"

        Returns
        -------
        X     : np.ndarray  shape=(N, D)
        y     : list[str]   label per sampel
        meta  : dict        statistik proses

        Raises
        ------
        ValueError  jika folder tidak ditemukan atau dataset kosong
        """
        folder = self._root / dataset_type
        if not folder.exists():
            raise ValueError(
                f"Folder dataset '{dataset_type}' tidak ditemukan: {folder}\n"
                f"Buat folder: dataset/{dataset_type}/<nama_user>/ dan isi dengan gambar."
            )

        user_dirs = sorted([d for d in folder.iterdir() if d.is_dir()])
        if not user_dirs:
            raise ValueError(
                f"Dataset '{dataset_type}' kosong – tidak ada subfolder di: {folder}"
            )

        features: List[np.ndarray] = []
        labels: List[str] = []
        skipped = 0

        for user_dir in user_dirs:
            label = user_dir.name
            img_paths = [
                p for p in user_dir.iterdir()
                if p.suffix.lower() in ALLOWED_EXT
            ]

            if not img_paths:
                logger.warning("Folder '%s' tidak memiliki gambar – dilewati.", label)
                continue

            for img_path in img_paths:
                result = self._process_one(img_path)
                if result is not None:
                    features.append(result)
                    labels.append(label)
                else:
                    skipped += 1

        if not features:
            raise ValueError(
                f"Tidak ada wajah terdeteksi dari dataset '{dataset_type}'. "
                "Pastikan setiap gambar memuat wajah yang dapat dideteksi Haar Cascade."
            )

        X = np.array(features)
        meta = {
            "dataset_type": dataset_type,
            "total_samples": len(features),
            "total_classes": len(set(labels)),
            "skipped_images": skipped,
            "classes": sorted(set(labels)),
        }
        logger.info(
            "Dataset '%s' dimuat: %d sampel, %d kelas, %d dilewati.",
            dataset_type, len(features), len(set(labels)), skipped,
        )
        return X, labels, meta

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _process_one(self, img_path: Path) -> np.ndarray | None:
        """
        Baca satu gambar → deteksi wajah → preprocess → ekstrak fitur.
        Kembalikan None jika tidak ada wajah terdeteksi.
        """
        image = cv2.imread(str(img_path))
        if image is None:
            logger.debug("Gagal membaca gambar: %s", img_path.name)
            return None

        faces = self._detector.detect(image)
        if not faces:
            logger.debug("Tidak ada wajah: %s", img_path.name)
            return None

        # Ambil wajah pertama (jika lebih dari satu)
        crop = self._detector.crop_face(image, faces[0])
        processed = self._preprocessor.process(crop)
        return self._extractor.extract(processed)
