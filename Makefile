# Variables
WEB_DIR = web-app
AI_DIR = ai-service
PYTHON_VENV = $(AI_DIR)/venv/bin/activate
AI_PORT = 8088

.PHONY: help setup install dev dev-web dev-front dev-ai migrate seed clear clean

# Tampilkan bantuan (default)
help:
	@echo "========================================================"
	@echo "      FaceLog (Face Recognition) Project Manager        "
	@echo "========================================================"
	@echo "Perintah yang tersedia:"
	@echo "  make setup      : Instal dependensi & siapkan database (install, migrate, seed)"
	@echo "  make install    : Instal dependensi Web (Composer & NPM) dan AI (Python Pip)"
	@echo "  make dev        : Menjalankan SEMUA service (Laravel, Vite, AI) secara parallel"
	@echo "  make dev-web    : Menjalankan Laravel server saja"
	@echo "  make dev-front  : Menjalankan Node/Vite frontend saja"
	@echo "  make dev-ai     : Menjalankan Python FastAPI service saja"
	@echo "  make migrate    : Eksekusi migrasi database"
	@echo "  make seed       : Eksekusi seeder database"
	@echo "  make clear      : Bersihkan cache Laravel, dataset, model, dan foto"
	@echo "  make clean      : Hapus instalasi (vendor, node_modules, venv, lock files)"
	@echo "========================================================"

# --- Setup & Install ---
setup: install migrate seed
	@echo "✅ Setup selesai! Silakan jalankan 'make dev' untuk memulai."

install:
	@echo "📦 Menginstal dependensi Laravel (PHP)..."
	cd $(WEB_DIR) && composer install
	@echo "📦 Menginstal dependensi Frontend (Node)..."
	cd $(WEB_DIR) && npm install
	@echo "📦 Menginstal dependensi AI Service (Python)..."
	cd $(AI_DIR) && python3 -m venv venv || true
	. $(PYTHON_VENV) && cd $(AI_DIR) && pip install -r requirements.txt
	@echo "✅ Semua dependensi berhasil diinstal!"

# --- Development Servers ---
dev:
	@echo "🚀 Menjalankan semua service... (Tekan Ctrl+C untuk berhenti)"
	make -j3 dev-web dev-front dev-ai

dev-web:
	@echo "🟢 Starting Laravel Server..."
	cd $(WEB_DIR) && php artisan serve

dev-front:
	@echo "🟢 Starting Vite Server..."
	cd $(WEB_DIR) && npm run dev

dev-ai:
	@echo "🟢 Starting AI FastAPI Server (Port $(AI_PORT))..."
	. $(PYTHON_VENV) && cd $(AI_DIR) && uvicorn src.main:app --host 127.0.0.1 --port $(AI_PORT) --reload

# --- Database Management ---
migrate:
	@echo "🛠 Menjalankan migrasi database..."
	cd $(WEB_DIR) && php artisan migrate

seed:
	@echo "🌱 Menjalankan seeder database..."
	cd $(WEB_DIR) && php artisan db:seed

# --- Utilities ---
clear:
	@echo "🧹 Membersihkan cache Laravel..."
	cd $(WEB_DIR) && php artisan optimize:clear
	@echo "🧹 Membersihkan pycache AI..."
	find $(AI_DIR) -type d -name "__pycache__" -exec rm -rf {} +
	@echo "🧹 Membersihkan Datasets, Model & Logs AI..."
	rm -rf $(AI_DIR)/dataset/train/*
	rm -rf $(AI_DIR)/dataset/val/*
	rm -rf $(AI_DIR)/dataset/test/*
	rm -rf $(AI_DIR)/dataset/logs/*.log
	rm -rf $(AI_DIR)/models/*.clf
	@echo "🧹 Membersihkan foto & logs Storage Laravel..."
	rm -rf $(WEB_DIR)/storage/app/public/faces/*
	rm -rf $(WEB_DIR)/storage/app/public/attendances/*
	rm -rf $(WEB_DIR)/storage/logs/*.log
	@echo "✅ Seluruh cache, dataset, model, logs, dan foto storage berhasil dibersihkan!"

clean:
	@echo "💥 Menghapus seluruh dependensi (Deep Clean)..."
	rm -rf $(WEB_DIR)/vendor
	rm -rf $(WEB_DIR)/node_modules
	rm -f $(WEB_DIR)/composer.lock
	rm -f $(WEB_DIR)/package-lock.json
	rm -rf $(AI_DIR)/venv
	@echo "✅ Seluruh dependensi berhasil dihapus! Jalankan 'make install' untuk menginstal ulang."
