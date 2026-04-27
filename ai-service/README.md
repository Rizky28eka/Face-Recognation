# AI Face Recognition Service

Sistem presensi otomatis berbasis pengenalan wajah menggunakan FastAPI, OpenCV (Haar Cascade), dan Scikit-Learn (KNN).

## Struktur Project

```text
ai-service/
├── src/
│   ├── main.py              # Entry point aplikasi
│   ├── api/
│   │   └── routes.py        # Definisi endpoint API
│   ├── services/
│   │   ├── face_detection.py      # Deteksi wajah (Haar Cascade)
│   │   ├── preprocessing.py       # Grayscale & Resize
│   │   ├── feature_extraction.py  # Image Flattening
│   │   ├── knn_model.py           # Load & Predict model
│   │   └── training.py            # Training pipeline
│   ├── utils/
│   └── schemas/
├── dataset/                 # Data wajah per user (folder user_1, user_2, dst)
├── models/                  # File model .pkl (knn_model.pkl)
├── requirements.txt         # Dependencies
└── README.md                # Dokumentasi
```

## Persiapan Dataset

1. Buat folder di dalam direktori `dataset/` untuk setiap user. Contoh: `dataset/rizky`, `dataset/eka`.
2. Masukkan foto wajah user ke dalam folder masing-masing. Pastikan foto hanya berisi satu wajah yang jelas.

## Instalasi

1. Pastikan Anda memiliki Python 3.8+ terinstal.
2. Install dependencies menggunakan pip:

```bash
pip install -r requirements.txt
```

## Menjalankan Server

Jalankan server menggunakan uvicorn:

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

Server akan berjalan di `http://localhost:8000`.

## Penggunaan Endpoint

### 1. Training Model (`/api/v1/train`)

Gunakan endpoint ini untuk melatih model berdasarkan dataset yang ada di folder `dataset/`.

- **Method**: `POST`
- **URL**: `http://localhost:8000/api/v1/train`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Training completed successfully. Processed 50/50 images.",
    "classes": ["user_1", "user_2"]
  }
  ```

### 2. Prediksi Wajah (`/api/v1/predict`)

Gunakan endpoint ini untuk mengenali wajah dari gambar yang diunggah.

- **Method**: `POST`
- **URL**: `http://localhost:8000/api/v1/predict`
- **Body**: `form-data` dengan key `file` (image file)
- **Response (Berhasil)**:
  ```json
  {
    "name": "user_1",
    "confidence": 0.87,
    "status": "recognized"
  }
  ```
- **Response (Tidak Dikenali)**:
  ```json
  {
    "name": "unknown",
    "confidence": 0.2,
    "status": "unrecognized"
  }
  ```

## Evaluasi Model (`tools/evaluate_model.py`)

Gunakan script ini untuk melakukan pengujian model yang lebih mendalam (Precision, Recall, F1-Score) menggunakan folder `dataset/train` dan `dataset/val`.

1.  Pastikan dataset sudah terbagi ke dalam folder `train/` dan `val/`.
2.  Jalankan script evaluasi:

```bash
export PYTHONPATH=$PYTHONPATH:.
./venv/bin/python tools/evaluate_model.py
```

Script ini akan menghasilkan:

- **Classification Report**: Berisi Precision, Recall, dan F1-Score untuk setiap user.
- **Accuracy Score**: Persentase total prediksi yang benar.
- **Update Dashboard**: Metrik pada dashboard web akan diperbarui secara otomatis.
