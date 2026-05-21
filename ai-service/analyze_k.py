"""
Analisis akurasi KNN terhadap nilai K menggunakan dataset aktual.
Jalankan dari direktori ai-service/:
    venv/bin/python3 analyze_k.py
"""

import os
import sys
import cv2
import numpy as np
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score

sys.path.insert(0, os.path.dirname(__file__))
from src.services.face_detection import FaceDetectionService
from src.services.preprocessing import PreprocessingService
from src.services.feature_extraction import FeatureExtractionService
from src.utils.config import settings

DATASET_PATH = settings.DATASET_PATH
K_VALUES     = [1, 3, 5, 7, 9]
CV_FOLDS     = 5
OUTPUT_IMG   = "k_analysis.png"
OUTPUT_JSON  = "k_analysis.json"


def load_dataset():
    face_detector  = FaceDetectionService()
    preprocessor   = PreprocessingService()
    feature_extractor = FeatureExtractionService()

    train_dir   = os.path.join(DATASET_PATH, "train")
    search_path = train_dir if os.path.exists(train_dir) else DATASET_PATH

    X, y = [], []
    folders = [d for d in os.listdir(search_path) if os.path.isdir(os.path.join(search_path, d))]
    print(f"Ditemukan {len(folders)} kelas di {search_path}")

    for user_id in sorted(folders):
        user_path = os.path.join(search_path, user_id)
        count = 0
        for img_name in os.listdir(user_path):
            if not img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue
            img = cv2.imread(os.path.join(user_path, img_name))
            if img is None:
                continue
            faces = face_detector.detect_faces(img)
            if len(faces) == 0:
                continue
            crop     = face_detector.crop_face(img, faces[0])
            prep     = preprocessor.process(crop)
            features = feature_extractor.extract(prep)
            X.append(features)
            y.append(user_id)
            count += 1
        print(f"  {user_id}: {count} gambar")

    return np.array(X), np.array(y)


def analyze_k(X, y):
    results = {}
    for k in K_VALUES:
        knn = KNeighborsClassifier(n_neighbors=k, metric='euclidean', weights='distance')
        cv  = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=42)
        scores = cross_val_score(knn, X, y, cv=cv, scoring='accuracy')
        mean_acc = scores.mean() * 100
        std_acc  = scores.std()  * 100
        results[k] = {"mean": round(mean_acc, 2), "std": round(std_acc, 2), "scores": [round(s*100,2) for s in scores]}
        print(f"  K={k}: {mean_acc:.2f}% ± {std_acc:.2f}%")
    return results


def plot_results(results):
    k_vals   = sorted(results.keys())
    means    = [results[k]["mean"] for k in k_vals]
    stds     = [results[k]["std"]  for k in k_vals]
    target_k   = 5
    target_acc = results[target_k]["mean"]

    fig, ax = plt.subplots(figsize=(9, 6))
    ax.errorbar(k_vals, means, yerr=stds, fmt='o-', color='#1a3a6b', linewidth=2.5,
                markersize=7, capsize=4, ecolor='#6b8cba', label='Akurasi ± Std')

    # Highlight production K
    ax.annotate(f'Production K={target_k} ({target_acc:.2f}%)',
                xy=(target_k, target_acc),
                xytext=(target_k + 0.3, target_acc - 2.5),
                arrowprops=dict(arrowstyle='->', color='red'),
                color='red', fontsize=10)
    ax.plot(target_k, target_acc, 'ro', markersize=10, zorder=5)

    ax.set_title('Analisis Akurasi terhadap Nilai K (KNN)', fontsize=14, fontweight='bold')
    ax.set_xlabel('Nilai K (Neighbor)', fontsize=12)
    ax.set_ylabel('Akurasi Keseluruhan (%)', fontsize=12)
    ax.set_xticks(k_vals)
    ax.set_ylim(60, 100)
    ax.grid(True, linestyle='--', alpha=0.5)
    ax.legend(fontsize=10)

    plt.tight_layout()
    output_img_name = f"k_analysis_k{target_k}.png"
    plt.savefig(output_img_name, dpi=150)
    print(f"\nGrafik disimpan: {output_img_name}")


def main():
    print("=== Load Dataset ===")
    X, y = load_dataset()
    print(f"\nTotal sampel: {len(X)} | Total kelas: {len(set(y))}")

    print(f"\n=== Analisis K (CV={CV_FOLDS}-fold) ===")
    results = analyze_k(X, y)

    with open(OUTPUT_JSON, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Data disimpan: {OUTPUT_JSON}")

    plot_results(results)

    target_k = 5
    print(f"\n>>> Model diset ke Production K={target_k} dengan akurasi {results[target_k]['mean']:.2f}%")


if __name__ == "__main__":
    main()
