import joblib
import numpy as np

try:
    model = joblib.load('models/knn_model.pkl')
    print("Model loaded")
    dummy_img = np.random.randint(0, 255, size=(10000,))
    X = dummy_img.reshape(1, -1)
    distances, _ = model.kneighbors(X)
    print("Dummy image avg distance:", np.mean(distances))
except Exception as e:
    print(e)
