# Variables
WEB_DIR     = web-app
AI_DIR      = ai-service
PYTHON_VENV = $(AI_DIR)/venv/bin/activate
AI_PORT     = 8088

.PHONY: help setup install dev dev-web dev-front dev-ai \
        migrate seed fresh sync-faces train-ai \
        clear clean storage-link

# ─── Help ────────────────────────────────────────────────────────────────────
help:
	@echo "========================================================"
	@echo "        Sikawan — Face Recognition Project Manager      "
	@echo "========================================================"
	@echo "Setup"
	@echo "  make setup          Instal dependensi, migrate, seed, storage:link"
	@echo "  make install        Instal Composer, NPM, dan Python venv"
	@echo "  make storage-link   Buat symlink storage Laravel"
	@echo ""
	@echo "Development"
	@echo "  make dev            Jalankan SEMUA service (Laravel + Vite + AI)"
	@echo "  make dev-web        Jalankan Laravel server saja"
	@echo "  make dev-front      Jalankan Vite frontend saja"
	@echo "  make dev-ai         Jalankan FastAPI AI service saja"
	@echo ""
	@echo "Database"
	@echo "  make migrate        Jalankan migrasi database"
	@echo "  make seed           Jalankan seeder database"
	@echo "  make fresh          migrate:fresh --seed + bersihkan dataset AI"
	@echo ""
	@echo "AI / Dataset"
	@echo "  make train-ai       Trigger training model via API"
	@echo "  make sync-faces     Sinkronisasi label folder dataset dengan ID user DB"
	@echo ""
	@echo "Utilitas"
	@echo "  make clear          Bersihkan cache, dataset, model, logs, dan storage"
	@echo "  make clean          Hapus semua dependensi (vendor, node_modules, venv)"
	@echo "========================================================"

# ─── Setup & Install ─────────────────────────────────────────────────────────
setup: install migrate seed storage-link
	@echo "✅ Setup selesai! Jalankan 'make dev' untuk memulai."

install:
	@echo "📦 Menginstal dependensi Laravel (Composer)..."
	cd $(WEB_DIR) && composer install
	@echo "📦 Menginstal dependensi Frontend (NPM)..."
	cd $(WEB_DIR) && npm install --legacy-peer-deps
	@echo "📦 Membuat Python venv dan menginstal dependensi AI..."
	cd $(AI_DIR) && python3 -m venv venv || true
	. $(PYTHON_VENV) && cd $(AI_DIR) && pip install -r requirements.txt
	@echo "✅ Semua dependensi berhasil diinstal!"

storage-link:
	@echo "🔗 Membuat symlink storage Laravel..."
	cd $(WEB_DIR) && php artisan storage:link

# ─── Development Servers ─────────────────────────────────────────────────────
dev:
	@echo "🚀 Menjalankan semua service... (Ctrl+C untuk berhenti)"
	make -j3 dev-web dev-front dev-ai

dev-web:
	@echo "🟢 Laravel Server → http://127.0.0.1:8000"
	cd $(WEB_DIR) && php artisan serve

dev-front:
	@echo "🟢 Vite Dev Server..."
	cd $(WEB_DIR) && npm run dev

dev-ai:
	@echo "🟢 FastAPI AI Server → http://127.0.0.1:$(AI_PORT)"
	cd $(AI_DIR) && bash -c "source venv/bin/activate && python3 -m uvicorn src.main:app --host 127.0.0.1 --port $(AI_PORT) --reload"

# ─── Database ────────────────────────────────────────────────────────────────
migrate:
	@echo "🛠  Menjalankan migrasi database..."
	cd $(WEB_DIR) && php artisan migrate

seed:
	@echo "🌱 Menjalankan seeder database..."
	cd $(WEB_DIR) && php artisan db:seed

fresh:
	@echo "♻️  Reset database (migrate:fresh --seed) + bersihkan dataset AI..."
	cd $(WEB_DIR) && php artisan migrate:fresh --seed
	rm -rf $(AI_DIR)/dataset/raw/*
	rm -rf $(AI_DIR)/dataset/processed/*
	rm -rf $(AI_DIR)/dataset/train/*
	rm -rf $(AI_DIR)/dataset/val/*
	rm -rf $(AI_DIR)/dataset/test/*
	rm -f  $(AI_DIR)/dataset/inference_logs.json
	rm -f  $(AI_DIR)/dataset/metadata.json
	rm -f  $(AI_DIR)/models/knn_model.pkl
	rm -f  $(AI_DIR)/models/metrics.json
	@echo "✅ Database dan dataset AI sudah bersih. Daftarkan wajah ulang."

# ─── AI / Dataset ────────────────────────────────────────────────────────────
train-ai:
	@echo "🧠 Memulai training model AI..."
	curl -s -X POST http://127.0.0.1:$(AI_PORT)/api/v1/train | python3 -m json.tool
	@echo "✅ Training selesai!"

sync-faces:
	@echo "🔄 Sinkronisasi label folder dataset dengan ID user di DB..."
	cd $(WEB_DIR) && php artisan face:sync-labels

# ─── Utilities ───────────────────────────────────────────────────────────────
clear:
	@echo "🧹 Membersihkan cache Laravel..."
	cd $(WEB_DIR) && php artisan optimize:clear
	@echo "🧹 Membersihkan pycache AI..."
	find $(AI_DIR) -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@echo "🧹 Membersihkan dataset, model, dan logs AI..."
	rm -rf $(AI_DIR)/dataset/raw/*
	rm -rf $(AI_DIR)/dataset/processed/*
	rm -rf $(AI_DIR)/dataset/train/*
	rm -rf $(AI_DIR)/dataset/val/*
	rm -rf $(AI_DIR)/dataset/test/*
	rm -f  $(AI_DIR)/dataset/inference_logs.json
	rm -f  $(AI_DIR)/dataset/metadata.json
	rm -f  $(AI_DIR)/models/knn_model.pkl
	rm -f  $(AI_DIR)/models/metrics.json
	@echo "🧹 Membersihkan storage Laravel..."
	rm -rf $(WEB_DIR)/storage/app/public/faces/*
	rm -rf $(WEB_DIR)/storage/app/public/attendances/*
	rm -rf $(WEB_DIR)/storage/app/public/profile-photos/*
	find  $(WEB_DIR)/storage/logs -name "*.log" -delete 2>/dev/null || true
	@echo "✅ Bersih!"

clean:
	@echo "💥 Menghapus seluruh dependensi (deep clean)..."
	rm -rf $(WEB_DIR)/vendor
	rm -rf $(WEB_DIR)/node_modules
	rm -f  $(WEB_DIR)/composer.lock
	rm -f  $(WEB_DIR)/package-lock.json
	rm -rf $(AI_DIR)/venv
	@echo "✅ Selesai. Jalankan 'make install' untuk menginstal ulang."
