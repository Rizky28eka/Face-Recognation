"""
Response Schemas (Pydantic v2)
Semua model request/response API didefinisikan di sini.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# /train
# ---------------------------------------------------------------------------

class TrainRequest(BaseModel):
    dataset_type: str = Field(
        "primary",
        description="Sumber dataset: 'primary' | 'secondary' | 'combined'",
        examples=["primary"],
    )
    use_augmentation: bool = Field(
        False,
        description="Aktifkan augmentasi gambar (hanya berlaku untuk dataset primer)",
    )


class TrainResponse(BaseModel):
    message: str = Field(..., examples=["training completed"])
    dataset_used: str = Field(..., examples=["primary"])
    total_samples: int = Field(..., examples=[120])
    total_classes: int = Field(..., examples=[5])
    model_path: str = Field(..., examples=["models/knn_model.pkl"])


# ---------------------------------------------------------------------------
# /evaluate
# ---------------------------------------------------------------------------

class EvaluateRequest(BaseModel):
    dataset_type: str = Field(
        "primary",
        description="Dataset yang dievaluasi: 'primary' | 'secondary'",
        examples=["primary"],
    )


class EvaluateResponse(BaseModel):
    accuracy: float = Field(..., ge=0.0, le=1.0, examples=[0.85])
    dataset_used: str = Field(..., examples=["primary"])
    total_samples: int = Field(..., examples=[60])
    correct_predictions: int = Field(..., examples=[51])
    report: Optional[str] = Field(
        None, description="Classification report teks (opsional)"
    )


# ---------------------------------------------------------------------------
# /predict
# ---------------------------------------------------------------------------

class PredictResponse(BaseModel):
    name: str = Field(..., examples=["user_1"])
    confidence: float = Field(..., ge=0.0, le=1.0, examples=[0.87])
    status: str = Field(..., examples=["recognized"])
    message: Optional[str] = Field(None, examples=["Face recognized successfully"])

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "user_1",
                    "confidence": 0.87,
                    "status": "recognized",
                    "message": "Face recognized successfully",
                },
                {
                    "name": "unknown",
                    "confidence": 0.21,
                    "status": "unrecognized",
                    "message": "Confidence below threshold",
                },
            ]
        }
    }


# ---------------------------------------------------------------------------
# Error
# ---------------------------------------------------------------------------

class ErrorResponse(BaseModel):
    error: str = Field(..., examples=["No face detected in the uploaded image"])
    code: str = Field(..., examples=["NO_FACE_DETECTED"])
