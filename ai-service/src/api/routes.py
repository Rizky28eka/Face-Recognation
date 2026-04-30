from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import cv2
import numpy as np
import io
import os
import json
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

@router.get("/faces/status")
async def get_status():
    """
    Returns the current status and metrics of the trained face recognition model.
    """
    metrics = {
        "accuracy": "N/A", 
        "precision": "N/A", 
        "recall": "N/A", 
        "f1_score": "N/A", 
        "total_images": 0, 
        "total_classes": 0, 
        "last_trained": "Never", 
        "status": "Not Trained"
    }
    
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    metrics_path = os.path.join(project_root, settings.METRICS_PATH)
    
    if os.path.exists(metrics_path):
        try:
            with open(metrics_path, "r") as f:
                metrics = json.load(f)
        except Exception:
            pass
            
    return metrics

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
        name, confidence, avg_distance = knn_service.predict(features)
        print(f"[DEBUG ROUTES] Final Match -> Name: {name}, Confidence: {confidence:.4f}, Dist: {avg_distance:.2f}")
        
        if confidence >= settings.RECOGNITION_THRESHOLD:
            return {"name": name, "confidence": round(confidence, 2), "status": "recognized"}
        else:
            return {"name": "unknown", "confidence": round(confidence, 2), "status": "unrecognized"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-face")
async def add_face(
    name: str = Form(...),
    index: int = Form(0),
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

    # ================================================================
    # CEK DUPLIKASI WAJAH — Jalankan di SETIAP foto (bukan hanya index 0)
    # Mencegah 1 wajah mendaftarkan lebih dari 1 akun.
    # ================================================================
    if knn_service.is_model_available():
        face_crop_temp = face_detector.crop_face(image, faces[0])
        preprocessed_temp = preprocessor.process(face_crop_temp)
        features_temp = feature_extractor.extract(preprocessed_temp)
        
        predicted_name, confidence, avg_distance = knn_service.predict(features_temp)
        
        print(f"[DUPLIKASI CHECK] Foto index={index} | Prediksi: '{predicted_name}' | Confidence: {confidence:.4f} | Avg Distance: {avg_distance:.2f} | Mendaftar sebagai: '{safe_name}'")
        
        # Wajah ini sangat mirip dengan wajah yang sudah terdaftar atas nama ORANG LAIN
        # Threshold avg_distance < 2800: jarak yang sangat dekat (hampir pasti wajah yang sama)
        if avg_distance < 2800 and predicted_name != safe_name:
            print(f"[DUPLIKASI DITOLAK] Wajah cocok dengan '{predicted_name}' (distance={avg_distance:.2f}), bukan '{safe_name}'")
            raise HTTPException(
                status_code=409, 
                detail=f"Wajah ini terdeteksi sudah terdaftar atas nama akun lain ({predicted_name.split('_')[0]}). Satu wajah hanya boleh memiliki satu akun."
            )

    # Buat path absolut ke dataset (2 level up dari file routes.py: api/ -> src/ -> root)
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    base_dataset_path = os.path.join(project_root, settings.DATASET_PATH)
    
    train_dir = os.path.join(base_dataset_path, 'train', safe_name)
    val_dir = os.path.join(base_dataset_path, 'val', safe_name)

    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(val_dir, exist_ok=True)

    # Jika ini adalah foto pertama dari sesi registrasi (index 0), hapus semua foto sebelumnya
    if index == 0:
        for folder in [train_dir, val_dir]:
            for filename in os.listdir(folder):
                file_path = os.path.join(folder, filename)
                try:
                    if os.path.isfile(file_path) or os.path.islink(file_path):
                        os.unlink(file_path)
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)
                except Exception as e:
                    print(f'Failed to delete {file_path}. Reason: {e}')

    # Hitung jumlah foto yang sudah ada (bisa 0 jika index=0)
    existing = len([f for f in os.listdir(train_dir) if f.endswith(('.jpg', '.jpeg', '.png'))])
    
    # Simpan ke train (80%) dan val (20%) - ambil setiap 5 foto ke val
    filename = f"{safe_name}_{existing + 1:04d}.jpg"
    train_path = os.path.join(train_dir, filename)
    
    # Deteksi wajah untuk validasi saja
    face_detector.crop_face(image, faces[0])
    
    # Simpan gambar aslinya, agar saat ditraining face detector bisa menemukan wajah dengan benar (mencegah double-crop distortion)
    cv2.imwrite(train_path, image)

    # Salin ke val juga untuk validasi
    if (existing + 1) % 5 == 0 or existing == 0:
        val_path = os.path.join(val_dir, filename)
        shutil.copy2(train_path, val_path)

    # Update metadata.json
    metadata_path = os.path.join(base_dataset_path, "metadata.json")
    if os.path.exists(metadata_path):
        try:
            with open(metadata_path, "r") as f:
                meta = json.load(f)
            
            classes = meta.get("classes", [])
            user_entry = next((c for c in classes if c.get("class") == safe_name), None)
            
            if user_entry:
                old_saved = user_entry.get("saved", 0)
                if (existing + 1) > old_saved:
                    meta["stats"]["total_images"] += ((existing + 1) - old_saved)
                    user_entry["saved"] = existing + 1
            else:
                classes.append({
                    "class": safe_name,
                    "saved": existing + 1,
                    "failed": 0,
                    "hash": "user_registration"
                })
                meta["stats"]["total_classes"] = len(classes)
                meta["stats"]["total_images"] += 1
            
            meta["classes"] = classes
            with open(metadata_path, "w") as f:
                json.dump(meta, f, indent=2)
        except Exception as e:
            print(f"Gagal mengupdate metadata.json: {e}")

    return {
        "status": "success",
        "message": f"Wajah '{name}' berhasil ditambahkan ke dataset.",
        "name": safe_name,
        "photo_count": existing + 1,
        "saved_to": train_path
    }
