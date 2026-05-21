import os
import cv2
import numpy as np
import joblib
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import classification_report, accuracy_score
from src.services.face_detection import FaceDetectionService
from src.services.preprocessing import PreprocessingService
from src.services.feature_extraction import FeatureExtractionService

def prepare_data(directory, face_detector, preprocessor, feature_extractor, user_id):
    """Processes a single user directory and extracts features."""
    X = []
    y = []
    if not os.path.exists(directory):
        return X, y
        
    for img_name in os.listdir(directory):
        if not img_name.lower().endswith(('.png', '.jpg', '.jpeg')): continue
        img_path = os.path.join(directory, img_name)
        image = cv2.imread(img_path)
        if image is None: continue
        
        # Detect face
        faces = face_detector.detect_faces(image)
        if len(faces) > 0:
            face_crop = face_detector.crop_face(image, faces[0])
            preprocessed = preprocessor.process(face_crop)
            features = feature_extractor.extract(preprocessed)
            X.append(features)
            y.append(user_id)
    return X, y

def main():
    # Initialize services
    face_detector = FaceDetectionService()
    preprocessor = PreprocessingService()
    feature_extractor = FeatureExtractionService()
    
    dataset_base = "dataset"
    train_dir = os.path.join(dataset_base, "train")
    val_dir = os.path.join(dataset_base, "val")
    test_dir = os.path.join(dataset_base, "test")
    model_path = "models/knn_model.pkl"
    
    # 1. Collect and Categorize Data
    print("\n--- [1/5] Collecting and Categorizing Data ---")
    all_synthetic_X = []
    all_synthetic_y = []
    all_real_X = []
    all_real_y = []

    for d in [train_dir, val_dir, test_dir]:
        if not os.path.exists(d): continue
        print(f"Scanning {d}...")
        for user_id in os.listdir(d):
            user_path = os.path.join(d, user_id)
            if not os.path.isdir(user_path): continue
            
            X, y = prepare_data(user_path, face_detector, preprocessor, feature_extractor, user_id)
            if "synthetic" in user_id.lower():
                all_synthetic_X.extend(X)
                all_synthetic_y.extend(y)
            else:
                all_real_X.extend(X)
                all_real_y.extend(y)

    if not all_synthetic_X or not all_real_X:
        print("Error: Missing synthetic or real data. Please check dataset folders.")
        return

    from sklearn.model_selection import train_test_split
    
    # 2. Split Real Data: Take 13 images for Pure Validation (approx 10%)
    X_real_rem, X_val, y_real_rem, y_val = train_test_split(
        all_real_X, all_real_y, test_size=13, random_state=42, stratify=all_real_y
    )
    
    # 3. Split Synthetic Data (70/30)
    X_syn_train, X_syn_test, y_syn_train, y_syn_test = train_test_split(
        all_synthetic_X, all_synthetic_y, test_size=0.3, random_state=42
    )

    # 4. Split Remaining Real Data (70/30) and Mix
    X_real_train, X_real_test, y_real_train, y_real_test = train_test_split(
        X_real_rem, y_real_rem, test_size=0.3, random_state=42, stratify=y_real_rem
    )

    # Final Mixed Sets for Training and Testing
    X_train = X_syn_train + X_real_train
    y_train = y_syn_train + y_real_train
    
    X_test = X_syn_test + X_real_test
    y_test = y_syn_test + y_real_test

    # 5. Train Model
    print("\n--- [2/5] Training KNN Model (Mixed Synthetic + Real) ---")
    knn = KNeighborsClassifier(n_neighbors=1, metric='euclidean')
    knn.fit(X_train, y_train)
    joblib.dump(knn, model_path)
    print(f"Model saved to {model_path}")

    # 6. Evaluate Phases
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    
    def get_metrics(X, y_true):
        if len(X) == 0: return 0, 0, 0, 0
        y_pred = knn.predict(X)
        acc = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, average='weighted', zero_division=0)
        rec = recall_score(y_true, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_true, y_pred, average='weighted', zero_division=0)
        return acc, prec, rec, f1

    test_metrics = get_metrics(X_test, y_test)
    val_metrics = get_metrics(X_val, y_val) # Purely Real
    
    # Overall Evaluation (Everything)
    overall_X = all_synthetic_X + all_real_X
    overall_y = all_synthetic_y + all_real_y
    overall_metrics = get_metrics(overall_X, overall_y)

    print("\n" + "="*50)
    print("MIXED PHASED EVALUATION RESULTS (70/20/10)")
    print("="*50)
    print(f"Phase 1: Testing (Mixed)       | Acc: {test_metrics[0]*100:.2f}%")
    print(f"Phase 2: Validation (Real)    | Acc: {val_metrics[0]*100:.2f}%")
    print(f"Phase 3: Overall Evaluation   | Acc: {overall_metrics[0]*100:.2f}%")
    print("="*50)

    # Print per-user details for Chapter 4
    from sklearn.metrics import classification_report
    y_pred_overall = knn.predict(overall_X)
    print("\nDETAILED CLASSIFICATION REPORT (OVERALL):")
    print(classification_report(overall_y, y_pred_overall, zero_division=0))

    # Save metrics for dashboard
    import json
    from datetime import datetime
    metrics_data = {
        "accuracy": round(overall_metrics[0] * 100, 2),
        "precision": round(overall_metrics[1] * 100, 2),
        "recall": round(overall_metrics[2] * 100, 2),
        "f1_score": round(overall_metrics[3] * 100, 2),
        "test_acc": round(test_metrics[0] * 100, 2),
        "val_acc": round(val_metrics[0] * 100, 2),
        "total_images": len(overall_X),
        "total_classes": len(set(overall_y)),
        "last_trained": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "status": "ready"
    }
    with open("models/metrics.json", "w") as f:
        json.dump(metrics_data, f)
    print("Metrics updated for dashboard.")

if __name__ == "__main__":
    main()
