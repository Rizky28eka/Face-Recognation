import os
import cv2
import numpy as np
import joblib
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import classification_report, accuracy_score
from src.services.face_detection import FaceDetectionService
from src.services.preprocessing import PreprocessingService
from src.services.feature_extraction import FeatureExtractionService

def prepare_data(directory, face_detector, preprocessor, feature_extractor):
    X = []
    y = []
    
    user_folders = [d for d in os.listdir(directory) if os.path.isdir(os.path.join(directory, d))]
    
    print(f"Processing directory: {directory}")
    for user_id in user_folders:
        user_path = os.path.join(directory, user_id)
        processed_count = 0
        for img_name in os.listdir(user_path):
            if not img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue
            
            img_path = os.path.join(user_path, img_name)
            image = cv2.imread(img_path)
            if image is None:
                continue

            # Detect face
            faces = face_detector.detect_faces(image)
            if len(faces) > 0:
                face_crop = face_detector.crop_face(image, faces[0])
                preprocessed = preprocessor.process(face_crop)
                features = feature_extractor.extract(preprocessed)
                
                X.append(features)
                y.append(user_id)
                processed_count += 1
        
        print(f"  - {user_id}: {processed_count} images processed")
   
    return np.array(X), np.array(y)

def main():
    # Initialize services
    face_detector = FaceDetectionService()
    preprocessor = PreprocessingService()
    feature_extractor = FeatureExtractionService()
    
    train_dir = "dataset/train"
    val_dir = "dataset/val"
    model_path = "models/knn_model.pkl"
    
    if not os.path.exists(train_dir) or not os.path.exists(val_dir):
        print("Error: train or val directory not found in 'dataset/'.")
        return

    # 1. Prepare Training Data
    print("\n--- [1/3] Preparing Training Data ---")
    X_train, y_train = prepare_data(train_dir, face_detector, preprocessor, feature_extractor)
    
    if len(X_train) == 0:
        print("Error: No training data found.")
        return

    # 2. Train Model
    print("\n--- [2/3] Training KNN Model ---")
    # Using k=3 as default
    knn = KNeighborsClassifier(n_neighbors=min(3, len(X_train)), metric='euclidean')
    knn.fit(X_train, y_train)
    
    # Save model
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(knn, model_path)
    print(f"Model saved to {model_path}")

    # 3. Prepare Validation Data and Test
    print("\n--- [3/3] Evaluating on Validation Data ---")
    X_val, y_val = prepare_data(val_dir, face_detector, preprocessor, feature_extractor)
    
    if len(X_val) == 0:
        print("Warning: No validation data found. Skipping evaluation.")
        return

    # Predict
    y_pred = knn.predict(X_val)
    
    # Results
    print("\n" + "="*50)
    print("EVALUATION RESULTS")
    print("="*50)
    print(f"Accuracy Score: {accuracy_score(y_val, y_pred)*100:.2f}%")
    print("\nDetailed Classification Report:")
    print(classification_report(y_val, y_pred))
    print("="*50)

    # Save metrics for dashboard
    import json
    from datetime import datetime
    metrics = {
        "accuracy": round(accuracy_score(y_val, y_pred) * 100, 2),
        "total_images": len(X_train) + len(X_val),
        "total_classes": len(set(y_train)),
        "classes": list(set(y_train)),
        "last_trained": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "status": "ready",
        "evaluation_type": "train_val_split"
    }
    with open("models/metrics.json", "w") as f:
        json.dump(metrics, f)
    print("Metrics updated for dashboard.")

if __name__ == "__main__":
    main()
