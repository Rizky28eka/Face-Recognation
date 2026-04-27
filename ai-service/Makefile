.PHONY: help setup-dirs install clean-datasets

DOWNLOAD_DIR := $(HOME)/Downloads
PRIMARY_DIR := dataset/primary
SECONDARY_DIR := dataset/secondary
LFW_ZIP := $(DOWNLOAD_DIR)/lfw-dataset.zip

help: ## Menampilkan panduan Makefile
	@echo "Face Recognition AI Service - Makefile"
	@echo "======================================"
	@echo "Perintah yang tersedia:"
	@echo "  make install         : Mengunduh & mengekstrak dataset LFW ke sekunder"
	@echo "  make clean-datasets  : Menghapus seluruh isi dataset sekunder"
	@echo "  make run             : Menjalankan server FastAPI (Development)"

run:
	@echo "Menjalankan AI Service di http://127.0.0.1:8088 ..."
	PYTHONPATH=src venv/bin/uvicorn src.main:app --host 127.0.0.1 --port 8088 --reload

setup-dirs:
	@mkdir -p $(PRIMARY_DIR) $(SECONDARY_DIR) $(DOWNLOAD_DIR)

install: setup-dirs ## Install LFW dataset ke secondary
	@echo "=========================================="
	@echo "Labeled Faces in the Wild (Dataset Sekunder)"
	@echo "=========================================="
	@if [ ! -f "$(LFW_ZIP)" ]; then \
		echo "Mengunduh LFW Dataset..."; \
		curl -L -o "$(LFW_ZIP)" "https://www.kaggle.com/api/v1/datasets/download/jessicali9530/lfw-dataset"; \
	else \
		echo "File LFW Dataset sudah ada di $(LFW_ZIP)"; \
	fi
	@echo "Mengekstrak LFW ke $(SECONDARY_DIR)..."
	@mkdir -p dataset/temp_lfw
	@unzip -q -o "$(LFW_ZIP)" -d dataset/temp_lfw/
	@if [ -d "dataset/temp_lfw/lfw-deepfunneled/lfw-deepfunneled" ]; then \
		mv dataset/temp_lfw/lfw-deepfunneled/lfw-deepfunneled/* $(SECONDARY_DIR)/; \
	elif [ -d "dataset/temp_lfw/lfw-deepfunneled" ]; then \
		mv dataset/temp_lfw/lfw-deepfunneled/* $(SECONDARY_DIR)/; \
	else \
		mv dataset/temp_lfw/* $(SECONDARY_DIR)/ 2>/dev/null || true; \
	fi
	@rm -rf dataset/temp_lfw
	@echo ""
	@echo "🎉 Setup Dataset Selesai!"
	@echo "Dataset publik (LFW) sudah diletakkan di $(SECONDARY_DIR)/"
	@echo "Untuk $(PRIMARY_DIR)/, silakan isi dengan foto wajah asli pengguna."

clean-datasets: ## Menghapus data di dataset/secondary
	@echo "Menghapus isi $(SECONDARY_DIR)..."
	@rm -rf $(SECONDARY_DIR)/*
	@touch $(SECONDARY_DIR)/.gitkeep
	@echo "✅ Dataset sekunder berhasil dibersihkan."
