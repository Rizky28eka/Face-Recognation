"""
API Routes
==========
Mendefinisikan endpoint /train, /evaluate, dan /predict.
"""

import logging
from fastapi import APIRouter, File, UploadFile, HTTPException, Request

from schemas.response import (
    TrainRequest, TrainResponse,
    EvaluateRequest, EvaluateResponse,
    PredictResponse, ErrorResponse
)
from services.face_detection import FaceDetectionService
from services.preprocessing import PreprocessingService
from services.feature_extraction import FeatureExtractionService
from services.dataset_loader import DatasetLoaderService
from services.augmentation import AugmentationService
from services.knn_model import KNNModelService
from services.training import TrainingService
from services.evaluation import EvaluationService
from utils.image_utils import read_uploaded_image

logger = logging.getLogger(__name__)

router = APIRouter()

# Singleton helpers
_face_detector = FaceDetectionService()
_preprocessor = PreprocessingService()
_feature_extractor = FeatureExtractionService()
_dataset_loader = DatasetLoaderService(_face_detector, _preprocessor, _feature_extractor)
_augmentation = AugmentationService()


def _get_model_service(request: Request) -> KNNModelService:
    return request.app.state.model_service


@router.post(
    "/train",
    response_model=TrainResponse,
    summary="Latih model KNN dari dataset primer/sekunder",
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    }
)
async def train_endpoint(req: TrainRequest, request: Request):
    """
    Melatih model KNN.

    - **dataset_type**: `primary` (default) | `secondary` | `combined`
    - **use_augmentation**: `true` | `false` (hanya berlaku jika melibatkan `primary`)
    """
    model_service = _get_model_service(request)
    trainer = TrainingService(_dataset_loader, _augmentation, model_service)

    try:
        result = trainer.train(req.dataset_type, req.use_augmentation)
        return TrainResponse(**result)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail={"error": str(exc), "code": "TRAINING_DATA_ERROR"})
    except Exception as exc:
        logger.exception("Kesalahan saat training.")
        raise HTTPException(status_code=500, detail={"error": str(exc), "code": "INTERNAL_ERROR"})


@router.post(
    "/evaluate",
    response_model=EvaluateResponse,
    summary="Evaluasi performa model",
)
async def evaluate_endpoint(req: EvaluateRequest, request: Request):
    """
    Mengukur akurasi model terhadap dataset `primary` atau `secondary`.
    """
    model_service = _get_model_service(request)
    evaluator = EvaluationService(_dataset_loader, model_service)

    try:
        result = evaluator.evaluate(req.dataset_type)
        return EvaluateResponse(**result)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail={"error": str(exc), "code": "MODEL_NOT_LOADED"})
    except ValueError as exc:
        raise HTTPException(status_code=400, detail={"error": str(exc), "code": "EVAL_DATA_ERROR"})
    except Exception as exc:
        logger.exception("Kesalahan saat evaluasi.")
        raise HTTPException(status_code=500, detail={"error": str(exc), "code": "INTERNAL_ERROR"})


@router.post(
    "/predict",
    response_model=PredictResponse,
    summary="Prediksi identitas wajah dari gambar",
)
async def predict_endpoint(
    request: Request,
    file: UploadFile = File(..., description="Gambar wajah (JPEG / PNG)")
):
    """
    Menerima upload gambar, mendeteksi wajah, dan memprediksi identitasnya.
    Penting: Model harus sudah terlatih (menggunakan /train dengan dataset primer).
    """
    model_service = _get_model_service(request)

    if not model_service.is_loaded():
        raise HTTPException(
            status_code=503,
            detail={"error": "Model belum siap. Lakukan /train terlebih dahulu.", "code": "MODEL_NOT_LOADED"}
        )

    allowed_types = {"image/jpeg", "image/png", "image/jpg"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail={"error": "Format harus JPEG/PNG", "code": "INVALID_FILE"})

    raw_bytes = await file.read()
    image = read_uploaded_image(raw_bytes)
    if image is None:
        raise HTTPException(status_code=400, detail={"error": "Gagal membaca gambar", "code": "BAD_IMAGE"})

    faces = _face_detector.detect(image)
    if not faces:
        raise HTTPException(status_code=400, detail={"error": "Tidak ada wajah terdeteksi", "code": "NO_FACE"})

    # Ambil wajah pertama
    crop = _face_detector.crop_face(image, faces[0])
    processed = _preprocessor.process(crop)
    features = _feature_extractor.extract(processed)

    result = model_service.predict(features)
    return PredictResponse(**result)
