import os
import cv2
import joblib
import shutil
import numpy as np
import json
from datetime import datetime
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from src.services.face_detection import FaceDetectionService
from src.services.preprocessing import PreprocessingService
from src.services.feature_extraction import FeatureExtractionService
from src.utils.config import settings


class TrainingService:
    def __init__(self):
        self.dataset_path      = settings.DATASET_PATH
        self.model_path        = settings.MODEL_PATH
        self.metrics_path      = settings.METRICS_PATH
        self.face_detector     = FaceDetectionService()
        self.preprocessor      = PreprocessingService()
        self.feature_extractor = FeatureExtractionService()

    # ── Public ────────────────────────────────────────────────────────────

    def run_training(self):
        raw_dir   = os.path.join(self.dataset_path, "raw")
        train_dir = os.path.join(self.dataset_path, "train")

        if os.path.isdir(raw_dir) and any(os.scandir(raw_dir)):
            source_dir = raw_dir
        elif os.path.isdir(train_dir) and any(os.scandir(train_dir)):
            print("[TRAINING] raw/ not found — migrating train/ → raw/ ...")
            shutil.copytree(train_dir, raw_dir, dirs_exist_ok=True)
            source_dir = raw_dir
        else:
            return {"status": "error", "message": "No images found in dataset/raw/."}

        # 1. Load ALL images per class
        class_data = self._load_per_class(source_dir)
        if not class_data:
            return {"status": "error", "message": "No faces detected in dataset."}

        n_classes = len(class_data)

        # 2. Per-class split: 70% train · 15% val · 15% test
        #    Augmentasi HANYA pada train — val & test pakai foto asli
        X_train, y_train = [], []
        X_val,   y_val   = [], []
        X_test,  y_test  = [], []
        split_map        = {}

        for label, feats in class_data.items():
            n       = len(feats)
            indices = list(range(n))

            rng = np.random.default_rng(seed=42)
            rng.shuffle(indices)

            n_test  = max(1, round(n * 0.15))
            n_val   = max(1, round(n * 0.15))
            n_train = max(1, n - n_val - n_test)

            if n_train + n_val + n_test > n:
                n_test = max(0, n - n_train - n_val)
                n_val  = max(0, n - n_train - n_test)

            train_idx = indices[:n_train]
            val_idx   = indices[n_train:n_train + n_val]
            test_idx  = indices[n_train + n_val:]

            split_map[label] = {"train": train_idx, "val": val_idx, "test": test_idx}

            for i in train_idx:
                X_train.append(feats[i])
                y_train.append(label)

            for i in val_idx:
                X_val.append(feats[i])
                y_val.append(label)
            for i in test_idx:
                X_test.append(feats[i])
                y_test.append(label)

        self._write_split_files(source_dir, split_map)

        X_train = np.array(X_train); y_train = np.array(y_train)
        X_val   = np.array(X_val);   y_val   = np.array(y_val)
        X_test  = np.array(X_test);  y_test  = np.array(y_test)

        n_total = sum(len(v) for v in class_data.values())
        print(f"[TRAINING] Classes: {n_classes} | Train: {len(X_train)} | Val: {len(X_val)} | Test: {len(X_test)}")

        # 3. Tune K on validation set
        best_k = self._tune_k(X_train, y_train, X_val, y_val, n_classes)

        # 4. Fit final model on train + val
        X_fit = np.concatenate([X_train, X_val])
        y_fit = np.concatenate([y_train, y_val])

        knn_final = KNeighborsClassifier(
            n_neighbors=min(best_k, len(X_fit)),
            metric='euclidean',
            weights='distance'
        )
        knn_final.fit(X_fit, y_fit)

        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(knn_final, self.model_path)

        self._sync_metadata(source_dir)

        # 5. Evaluate TAR on held-out test set (dengan threshold)
        tar_result = self._evaluate_tar(knn_final, X_test, y_test, n_classes)

        # 6. Evaluate FAR pada dataset/test/unknown/ (orang asing)
        far_result = self._evaluate_far(knn_final)

        # 7. Gabungkan metrics
        metrics = {
            # ── Performa klasifikasi (multi-class) ──
            "accuracy":   tar_result["accuracy"],
            "precision":  tar_result["precision"],
            "recall":     tar_result["recall"],
            "f1_score":   tar_result["f1_score"],
            "eval_method": tar_result["method"],

            # ── TAR/FAR (threshold-based) ──
            "tar":                  tar_result["tar"],
            "tar_tested":           tar_result["tested"],
            "far":                  far_result["far"],
            "trr":                  far_result["trr"],
            "far_tested":           far_result["tested"],
            "far_false_accepted":   far_result["false_accepted"],
            "threshold":            settings.RECOGNITION_THRESHOLD,

            # ── Dataset info ──
            "train_images":        len(X_train),
            "val_images":          len(X_val),
            "test_images":         len(X_test),
            "raw_images_scanned":  n_total,
            "total_classes":       n_classes,
            "best_k":              best_k,
            "classes":             sorted(set(y_fit.tolist())),
            "last_trained":        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status":              "ready",
            "single_class_mode":   n_classes == 1,
        }

        with open(self.metrics_path, "w") as f:
            json.dump(metrics, f, indent=2)

        return {"status": "success", "message": "Training completed", "metrics": metrics}

    # ── Private ───────────────────────────────────────────────────────────

    def _evaluate_tar(self, model, X_test, y_test, n_classes: int) -> dict:
        """
        True Acceptance Rate — foto user terdaftar yang benar diterima di atas threshold.
        Untuk multi-class juga hitung accuracy/precision/recall/F1 dari prediksi label.
        """
        if len(X_test) == 0:
            return {
                "accuracy": 0.0, "precision": 0.0, "recall": 0.0, "f1_score": 0.0,
                "tar": 0.0, "tested": 0, "method": "no test samples",
            }

        probas      = model.predict_proba(X_test)
        confidences = np.max(probas, axis=1)
        y_pred_raw  = np.array([model.classes_[np.argmax(p)] for p in probas])

        # TAR: foto user terdaftar → prediksi benar DAN confidence ≥ threshold
        correct_above = sum(
            1 for true, pred, conf in zip(y_test, y_pred_raw, confidences)
            if true == pred and conf >= settings.RECOGNITION_THRESHOLD
        )
        tar = round(correct_above / len(y_test) * 100, 2)

        if n_classes == 1:
            # Metrik klasifikasi trivial untuk single-class; TAR lebih bermakna
            acc = round(accuracy_score(y_test, y_pred_raw) * 100, 2)
            return {
                "accuracy":  acc,
                "precision": acc,
                "recall":    acc,
                "f1_score":  acc,
                "tar":       tar,
                "tested":    len(X_test),
                "method":    f"single-class holdout + threshold={settings.RECOGNITION_THRESHOLD} (n={len(X_test)})",
            }

        # Multi-class: gunakan label asli tanpa threshold untuk sklearn metrics
        acc  = round(accuracy_score(y_test, y_pred_raw) * 100, 2)
        prec = round(precision_score(y_test, y_pred_raw, average='weighted', zero_division=0) * 100, 2)
        rec  = round(recall_score(y_test, y_pred_raw, average='weighted', zero_division=0) * 100, 2)
        f1   = round(f1_score(y_test, y_pred_raw, average='weighted', zero_division=0) * 100, 2)

        return {
            "accuracy":  acc,
            "precision": prec,
            "recall":    rec,
            "f1_score":  f1,
            "tar":       tar,
            "tested":    len(X_test),
            "method":    f"holdout test set + threshold={settings.RECOGNITION_THRESHOLD} (n={len(X_test)})",
        }

    def _evaluate_far(self, model) -> dict:
        """
        False Acceptance Rate — foto orang asing yang salah diterima di atas threshold.
        Foto diambil dari dataset/test/unknown/.
        Single-class: gunakan distance-based confidence (exp(-dist/threshold)).
        Multi-class:  gunakan predict_proba confidence.
        """
        unknown_dir = os.path.join(self.dataset_path, "test", "unknown")
        empty       = {"far": None, "trr": None, "tested": 0, "false_accepted": 0}

        if not os.path.isdir(unknown_dir):
            return empty

        photos = [f for f in os.listdir(unknown_dir)
                  if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if not photos:
            return empty

        n_classes = len(model.classes_)

        # Hitung distance threshold dari training data (sama seperti knn_model.py)
        dist_threshold = None
        if n_classes == 1:
            try:
                X_train   = model._fit_X
                dists, _  = model.kneighbors(X_train)
                mean_d    = float(np.mean(dists[:, 0]))
                std_d     = float(np.std(dists[:, 0]))
                dist_threshold = mean_d + 2.0 * std_d
                print(f"[FAR EVAL] Distance threshold: {dist_threshold:.4f}")
            except Exception:
                pass

        false_accepted = 0
        tested         = 0

        for img_name in photos:
            image = cv2.imread(os.path.join(unknown_dir, img_name))
            if image is None:
                continue
            faces = self.face_detector.detect_faces(image)
            if not faces:
                continue

            crop = self.face_detector.crop_face(image, faces[0])
            prep = self.preprocessor.process(crop)
            feat = self.feature_extractor.extract(prep).reshape(1, -1)

            distances, _ = model.kneighbors(feat)
            min_dist     = float(distances[0][0])

            if n_classes == 1 and dist_threshold:
                confidence = float(np.exp(-min_dist / dist_threshold))
            else:
                proba      = model.predict_proba(feat)[0]
                confidence = float(np.max(proba))

            tested += 1
            if confidence >= settings.RECOGNITION_THRESHOLD:
                false_accepted += 1
                print(f"[FAR] FALSE ACCEPT: {img_name} conf={confidence:.4f} dist={min_dist:.2f}")
            else:
                print(f"[FAR] Correctly rejected: {img_name} conf={confidence:.4f} dist={min_dist:.2f}")

        if tested == 0:
            return empty

        far = round(false_accepted / tested * 100, 2)
        trr = round(100 - far, 2)

        print(f"[TRAINING] FAR={far}% TRR={trr}% ({false_accepted}/{tested} unknown faces)")
        return {"far": far, "trr": trr, "tested": tested, "false_accepted": false_accepted}

    def _sync_metadata(self, source_dir: str):
        """Rebuild metadata.json dari isi raw/ yang aktual."""
        metadata_path = os.path.join(self.dataset_path, "metadata.json")
        classes, total_images = [], 0

        for label in sorted(os.listdir(source_dir)):
            label_path = os.path.join(source_dir, label)
            if not os.path.isdir(label_path):
                continue
            imgs  = [f for f in os.listdir(label_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            count = len(imgs)
            if count == 0:
                continue
            classes.append({"class": label, "saved": count, "failed": 0})
            total_images += count

        metadata = {
            "last_updated": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            "stats": {"total_classes": len(classes), "total_images": total_images},
            "classes": classes,
        }
        with open(metadata_path, "w") as f:
            json.dump(metadata, f, indent=2)
        print(f"[TRAINING] metadata.json synced → {len(classes)} classes, {total_images} images")

    def _write_split_files(self, source_dir: str, split_map: dict):
        """
        Salin foto raw ke train/ val/ test/ sesuai split.
        Folder unknown di test/ TIDAK dihapus.
        """
        base = self.dataset_path

        for split_name in ("train", "val", "test"):
            split_root = os.path.join(base, split_name)
            if os.path.isdir(split_root):
                # Hapus semua subfolder KECUALI unknown
                for sub in os.listdir(split_root):
                    if sub == "unknown":
                        continue
                    shutil.rmtree(os.path.join(split_root, sub), ignore_errors=True)

        for label, splits in split_map.items():
            label_src = os.path.join(source_dir, label)
            all_imgs  = sorted([
                f for f in os.listdir(label_src)
                if f.lower().endswith(('.jpg', '.jpeg', '.png'))
            ])

            for split_name, idx_list in splits.items():
                dest_dir = os.path.join(base, split_name, label)
                os.makedirs(dest_dir, exist_ok=True)
                for i in idx_list:
                    if i < len(all_imgs):
                        shutil.copy2(
                            os.path.join(label_src, all_imgs[i]),
                            os.path.join(dest_dir, all_imgs[i])
                        )

        print(f"[TRAINING] Split files written → train/ val/ test/")

    def _load_per_class(self, split_path: str) -> dict:
        """Load feature vectors per class label dari folder split_path."""
        class_data = {}
        for label in sorted(os.listdir(split_path)):
            label_path = os.path.join(split_path, label)
            if not os.path.isdir(label_path):
                continue
            feats = []
            for img_name in sorted(os.listdir(label_path)):
                if not img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                    continue
                image = cv2.imread(os.path.join(label_path, img_name))
                if image is None:
                    continue
                faces = self.face_detector.detect_faces(image)
                if not faces:
                    continue
                crop = self.face_detector.crop_face(image, faces[0])
                prep = self.preprocessor.process(crop)
                feats.append(self.feature_extractor.extract(prep))
            if feats:
                class_data[label] = feats
        return class_data

    def _tune_k(self, X_train, y_train, X_val, y_val, n_classes: int) -> int:
        candidates = [1, 3, 5, 7, 9]
        best_k     = settings.KNN_NEIGHBORS

        if n_classes < 2:
            return 1

        val_classes = len(set(y_val))
        if len(X_val) > 0 and val_classes >= 2:
            best_score = 0.0
            for k in candidates:
                knn = KNeighborsClassifier(n_neighbors=min(k, len(X_train)),
                                           metric='euclidean', weights='distance')
                knn.fit(X_train, y_train)
                score = f1_score(y_val, knn.predict(X_val), average='weighted', zero_division=0)
                if score > best_score:
                    best_k, best_score = k, score
        else:
            min_count = int(min(np.bincount(np.unique(y_train, return_inverse=True)[1])))
            n_splits  = min(5, min_count)
            if n_splits >= 2:
                cv         = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
                best_score = 0.0
                for k in candidates:
                    knn = KNeighborsClassifier(n_neighbors=min(k, len(X_train)),
                                               metric='euclidean', weights='distance')
                    scores = cross_val_score(knn, X_train, y_train, cv=cv, scoring='f1_weighted')
                    if scores.mean() > best_score:
                        best_k, best_score = k, scores.mean()

        return best_k
