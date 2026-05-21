import json

def update_logs():
    metrics_path = "models/metrics.json"
    logs_path = "dataset/inference_logs.json"
    
    with open(metrics_path, "r") as f:
        metrics = json.load(f)
        
    with open(logs_path, "r") as f:
        logs = json.load(f)
        
    for entry in logs:
        entry["model_accuracy"] = metrics["accuracy"]
        entry["model_precision"] = metrics["precision"]
        entry["model_recall"] = metrics["recall"]
        entry["model_f1_score"] = metrics["f1_score"]
        
    with open(logs_path, "w") as f:
        json.dump(logs, f, indent=2)
    
    print(f"Updated {len(logs)} log entries with new metrics (Acc: {metrics['accuracy']}%)")

if __name__ == "__main__":
    update_logs()
