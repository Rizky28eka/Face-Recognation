# SIKAWAN: Sistem Kehadiran Wajah Karyawan

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python)](https://www.python.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)

**SIKAWAN** adalah sistem presensi otomatis berbasis biometrik wajah yang dirancang untuk meningkatkan akuntabilitas dan efisiensi pencatatan kehadiran karyawan. Sistem ini menggunakan arsitektur *decoupled* yang memisahkan logika bisnis (Laravel) dengan mesin kecerdasan buatan (FastAPI).

## 🚀 Fitur Utama

- **Face Recognition:** Identifikasi identitas menggunakan algoritma KNN (K=1) dan Haar Cascade.
- **Geofencing:** Validasi lokasi berbasis radius GPS (Rumus Haversine) untuk mencegah manipulasi lokasi.
- **Real-time Monitoring:** Dashboard statistik kehadiran dan log aktivitas untuk administrator.
- **Anti-Fraud:** Meminimalisir praktik titip absen melalui verifikasi biometrik.
- **Responsive UI:** Antarmuka modern yang dibangun dengan React dan Tailwind CSS.

## 🏗️ Arsitektur Sistem

Sistem ini menggunakan pendekatan **Microservices/Decoupled Architecture**:

1.  **Frontend (Web-App):** React.js + Inertia.js untuk pengalaman pengguna yang *seamless*.
2.  **Backend Logic (Laravel 11):** Menangani otentikasi, manajemen database PostgreSQL, dan validasi Geofencing.
3.  **AI Engine (FastAPI):** Layanan inferensi yang menangani deteksi wajah (Haar Cascade), ekstraksi fitur (LBPH), dan klasifikasi (KNN).

## 🧠 Algoritma & Performa

- **Deteksi Wajah:** Haar Cascade Classifier.
- **Ekstraksi Fitur:** Local Binary Patterns Histograms (LBPH).
- **Klasifikasi:** K-Nearest Neighbors (KNN) dengan K=1.
- **Akurasi Keseluruhan:** **95.42%** (Berdasarkan pengujian pada 131 sampel citra).
- **AUC-ROC:** 0.97 (*Excellent Classification*).
- **Rata-rata Latensi:** < 1 Detik per siklus presensi.

## 🛠️ Instalasi

### Prerequisites
- PHP >= 8.2
- Composer
- Python >= 3.10
- PostgreSQL
- Node.js & NPM

### Step 1: Backend (Laravel)
```bash
cd web-app
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
```

### Step 2: AI Service (FastAPI)
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # atau venv\Scripts\activate untuk Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## 📂 Struktur Direktori

- `/web-app`: Aplikasi utama berbasis Laravel (Frontend & Backend Logic).
- `/ai-service`: Layanan kecerdasan buatan berbasis FastAPI (Python).
- `/presentation`: Slide presentasi interaktif sidangan (Reveal.js).
- `/docker`: Konfigurasi containerization untuk deployment.

---

**Developed by Rizky Eka Haryadi**  
NIM: 22.11.4829  
Universitas AMIKOM Yogyakarta
