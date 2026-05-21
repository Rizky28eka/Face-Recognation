import os
import cv2
import json
import numpy as np
from datetime import datetime, timedelta
from src.services.face_detection import FaceDetectionService
from src.services.preprocessing import PreprocessingService
from src.services.feature_extraction import FeatureExtractionService
import joblib

def bulk_inference():
    # Initialize services
    face_detector = FaceDetectionService()
    preprocessor = PreprocessingService()
    feature_extractor = FeatureExtractionService()
    
    model_path = "models/knn_model.pkl"
    metrics_path = "models/metrics.json"
    logs_path = "dataset/inference_logs.json"
    
    if not os.path.exists(model_path):
        print("Error: Model not found.")
        return
        
    knn = joblib.load(model_path)
    with open(metrics_path, "r") as f:
        metrics = json.load(f)
        
    dataset_dir = "dataset"
    new_logs = []
    
    # We'll simulate logs over the last 2 hours
    base_time = datetime.now() - timedelta(hours=2)
    
    print("Running bulk inference on dataset...")
    
    # To avoid too many logs, we'll pick a few samples from each user
    count = 0
    for root, dirs, files in os.walk(dataset_dir):
        # Only process user folders, skip base and val/test if they are redundant
        # But user wants "based on images in folder datasets", so we process all
        user_id = os.path.basename(root)
        if user_id in ["train", "val", "test", "dataset"]: continue
        
        # Limit to 3 images per user for the log simulation
        images = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))][:3]
        
        for img_name in images:
            img_path = os.path.join(root, img_name)
            image = cv2.imread(img_path)
            if image is None: continue
            
            start_det = datetime.now()
            faces = face_detector.detect_faces(image)
            det_time = (datetime.now() - start_det).total_seconds() * 1000
            
            if len(faces) > 0:
                face_crop = face_detector.crop_face(image, faces[0])
                
                start_ext = datetime.now()
                preprocessed = preprocessor.process(face_crop)
                features = feature_extractor.extract(preprocessed)
                ext_time = (datetime.now() - start_ext).total_seconds() * 1000
                
                start_pred = datetime.now()
                # KNN prediction
                dist, idx = knn.kneighbors([features], n_neighbors=1)
                confidence = 1.0 - min(dist[0][0], 1.0)
                
                if confidence > 0.6: # Threshold
                    name = knn.predict([features])[0]
                    status = "recognized"
                else:
                    name = "unknown"
                    status = "unrecognized"
                
                pred_time = (datetime.now() - start_pred).total_seconds() * 1000
                
                # Create log entry
                log_entry = {
                    "name": name,
                    "confidence": round(float(confidence), 2),
                    "status": status,
                    "bbox": [int(x) for x in faces[0]],
                    "detection_time": round(det_time, 2),
                    "extraction_time": round(ext_time, 2),
                    "prediction_time": round(pred_time, 2),
                    "timestamp": (base_time + timedelta(minutes=count*5)).isoformat(),
                    "model_accuracy": metrics["accuracy"],
                    "model_f1_score": metrics["f1_score"],
                    "model_precision": metrics["precision"],
                    "model_recall": metrics["recall"]
                }
                new_logs.append(log_entry)
                count += 1
                print(f"  - Logged {img_name} as {name}")

    # Overwrite logs with these fresh ones (or append, but overwrite is cleaner for demo)
    with open(logs_path, "w") as f:
        json.dump(new_logs, f, indent=2)
    
    print(f"Successfully generated {len(new_logs)} fresh inference logs.")

if __name__ == "__main__":
    bulk_inference()
