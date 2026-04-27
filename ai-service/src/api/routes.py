from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import cv2
import numpy as np
import io
import os
import shutil
from src.services.face_detection import FaceDetectionService
from src.services.preprocessing import PreprocessingService
from src.services.feature_extraction import FeatureExtractionService
from src.services.knn_model import KNNModelService
from src.services.training import TrainingService
from src.utils.config import settings

router = APIRouter()

# Initialize services
face_detector = FaceDetectionService()
preprocessor = PreprocessingService()
feature_extractor = FeatureExtractionService()
knn_service = KNNModelService()
trainer = TrainingService()

@router.post("/train")
async def train_model():
    result = trainer.run_training()
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    knn_service.load_model()
    return result

@router.post("/predict")
async def predict_face(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file format.")

    if not knn_service.is_model_available():
        raise HTTPException(status_code=400, detail="Model not found.")

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        raise HTTPException(status_code=400, detail="Could not decode image.")

    faces = face_detector.detect_faces(image)
    if len(faces) == 0:
        return {"name": "unknown", "confidence": 0.0, "status": "unrecognized"}
    
    face_crop = face_detector.crop_face(image, faces[0])
    preprocessed = preprocessor.process(face_crop)
    features = feature_extractor.extract(preprocessed)
    
    try:
        name, confidence = knn_service.predict(features)
        
        if confidence >= settings.RECOGNITION_THRESHOLD:
            return {"name": name, "confidence": round(confidence, 2), "status": "recognized"}
        else:
            return {"name": "unknown", "confidence": round(confidence, 2), "status": "unrecognized"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-face")
async def add_face(
    name: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Tambahkan foto wajah baru ke dataset training.
    File akan disimpan di dataset/train/{name}/ dan dataset/val/{name}/.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only images are allowed.")

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        raise HTTPException(status_code=400, detail="Could not decode image.")

    # Deteksi wajah terlebih dahulu
    faces = face_detector.detect_faces(image)
    if len(faces) == 0:
        raise HTTPException(status_code=422, detail="Tidak ada wajah terdeteksi dalam foto. Pastikan wajah terlihat jelas.")

    # Sanitize name untuk dijadikan nama folder
    safe_name = name.strip().replace(" ", "_").lower()

    # Buat path absolut ke dataset (2 level up dari file routes.py: api/ -> src/ -> root)
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    base_dataset_path = os.path.join(project_root, settings.DATASET_PATH)
    
    train_dir = os.path.join(base_dataset_path, 'train', safe_name)
    val_dir = os.path.join(base_dataset_path, 'val', safe_name)

    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(val_dir, exist_ok=True)

    # Hitung jumlah foto yang sudah ada
    existing = len([f for f in os.listdir(train_dir) if f.endswith(('.jpg', '.jpeg', '.png'))])
    
    # Simpan ke train (80%) dan val (20%) - ambil setiap 5 foto ke val
    filename = f"{safe_name}_{existing + 1:04d}.jpg"
    train_path = os.path.join(train_dir, filename)
    
    # Crop wajah dan simpan
    face_crop = face_detector.crop_face(image, faces[0])
    preprocessed = preprocessor.process(face_crop)
    cv2.imwrite(train_path, preprocessed)

    # Salin ke val juga untuk validasi
    if (existing + 1) % 5 == 0 or existing == 0:
        val_path = os.path.join(val_dir, filename)
        shutil.copy2(train_path, val_path)

    return {
        "status": "success",
        "message": f"Wajah '{name}' berhasil ditambahkan ke dataset.",
        "name": safe_name,
        "photo_count": existing + 1,
        "saved_to": train_path
    }
