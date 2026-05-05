import json
import os
from datetime import datetime

class InferenceLogger:
    def __init__(self, log_file_path="dataset/inference_logs.json", max_logs=20):
        self.log_file_path = log_file_path
        self.max_logs = max_logs
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        # Ensure directory exists
        os.makedirs(os.path.dirname(self.log_file_path), exist_ok=True)
        # Ensure file exists
        if not os.path.exists(self.log_file_path):
            with open(self.log_file_path, "w") as f:
                json.dump([], f)

    def log(self, name: str, confidence: float, status: str, 
            detection_time: float = 0, extraction_time: float = 0, prediction_time: float = 0,
            bbox=None, metrics: dict = None):
        """
        Log an inference event with timing metrics and bounding box.
        """
        log_entry = {
            "name": name,
            "confidence": confidence,
            "status": status,
            "bbox": [int(v) for v in bbox] if bbox is not None else None,
            "detection_time": round(detection_time * 1000, 2),  # ms
            "extraction_time": round(extraction_time * 1000, 2), # ms
            "prediction_time": round(prediction_time * 1000, 2), # ms
            "timestamp": datetime.now().isoformat()
        }

        # Add global model metrics if provided
        if metrics:
            log_entry.update({
                "model_accuracy": metrics.get("accuracy"),
                "model_f1_score": metrics.get("f1_score"),
                "model_precision": metrics.get("precision"),
                "model_recall": metrics.get("recall")
            })

        try:
            with open(self.log_file_path, "r") as f:
                logs = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            logs = []

        logs.insert(0, log_entry)  # Insert at the beginning (newest first)
        
        # Keep only the latest max_logs
        if len(logs) > self.max_logs:
            logs = logs[:self.max_logs]

        try:
            with open(self.log_file_path, "w") as f:
                json.dump(logs, f, indent=2)
        except Exception as e:
            print(f"Failed to write inference log: {e}")

    def get_performance_stats(self):
        """
        Calculate average performance metrics from recent logs.
        """
        logs = self.get_recent_logs()
        if not logs:
            return {"avg_detection": 0, "avg_extraction": 0, "avg_prediction": 0}
        
        count = len(logs)
        det = sum(l.get("detection_time", 0) for l in logs) / count
        ext = sum(l.get("extraction_time", 0) for l in logs) / count
        pre = sum(l.get("prediction_time", 0) for l in logs) / count
        
        return {
            "avg_detection": round(det, 2),
            "avg_extraction": round(ext, 2),
            "avg_prediction": round(pre, 2)
        }

    def get_recent_logs(self):
        """
        Get the recent inference logs.
        """
        try:
            with open(self.log_file_path, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
