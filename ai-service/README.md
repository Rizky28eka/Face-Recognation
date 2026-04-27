# Face Recognition AI Service (Primary vs Secondary Dataset)

AI Service berbasis **FastAPI**, **Haar Cascade**, dan **K-Nearest Neighbors (KNN)**.
Dibangun dengan arsitektur modular yang memisahkan penggunaan dataset primer (data utama/real) dan dataset sekunder (data publik/validasi).

## 📁 Struktur Dataset

Sistem ini membedakan dataset menjadi dua jenis:
1. **Dataset Primer (`dataset/primary/`)**: Digunakan untuk melatih model utama yang akan dipakai saat runtime (prediksi). Mendukung proses **augmentasi gambar**.
2. **Dataset Sekunder (`dataset/secondary/`)**: Digunakan untuk pengujian, validasi, dan benchmarking. Model yang dilatih dari dataset sekunder tidak disimpan untuk runtime.

## 🚀 Cara Menjalankan

### 1. Persiapan Virtual Environment

```bash
cd ai-service
python3 -m venv venvpython3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Persiapan Dataset

Isi folder `dataset/primary/` dan `dataset/secondary/` dengan foto wajah.
Strukturnya harus menggunakan subfolder sebagai nama/label.

```text
dataset/primary/
├── user_1/
│   ├── foto_1.jpg
│   └── foto_2.jpg
└── user_2/
    └── foto_1.jpg
```

### 3. Menjalankan Server

```bash
cd src
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Buka Swagger UI di: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📡 API Endpoints

### `POST /api/v1/train`
Melatih model KNN.
- Payload: `{"dataset_type": "primary", "use_augmentation": true}`
- Model hanya akan disimpan ke `.pkl` jika menggunakan dataset `primary` atau `combined`.

### `POST /api/v1/evaluate`
Menghitung akurasi model yang saat ini di-*load* ke memory menggunakan dataset target.
- Payload: `{"dataset_type": "secondary"}`

### `POST /api/v1/predict`
Menerima file gambar (form-data: `file`) dan memprediksi identitas wajah.

---

## 🧠 Konsep Akademis (Skripsi)

1. **Deteksi Wajah (Haar Cascade)**: Mengekstrak Region of Interest (ROI) dari wajah dalam gambar yang lebih besar.
2. **Preprocessing**: Gambar di-grayscale dan di-resize ke dimensi seragam (100x100) untuk menjaga konsistensi dimensi vektor fitur.
3. **Augmentasi**: (Khusus primer) Memutar gambar dan menyesuaikan kecerahan untuk memperbanyak jumlah data latih dan mengurangi overfitting.
4. **Ekstraksi Fitur (Flatten)**: Mengubah matriks gambar 2D menjadi vektor 1D dengan normalisasi ke rentang nilai 0-1.
5. **Klasifikasi (KNN)**: Menghitung jarak (*Euclidean distance*) antara fitur gambar baru dengan fitur di dalam model, lalu memilih K terdekat untuk diprediksi.
6. **Confidence Score**: Dihitung berdasarkan nilai rata-rata jarak terhadap tetangga terdekat, menggunakan invers jarak (`1 / (1 + mean_distance)`).
