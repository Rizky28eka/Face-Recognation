"""
Face Recognition Attendance – AI Service
=========================================
Entry point utama FastAPI.
Model KNN di-load ke memory saat startup agar endpoint /predict
langsung siap digunakan tanpa training ulang.
"""

import logging
import os
import sys
from contextlib import asynccontextmanager

# Tambahkan path folder 'src' ke dalam sys.path agar module di dalamnya (seperti 'api' dan 'services') bisa terdeteksi
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from services.knn_model import KNNModelService

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s – %(message)s",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan – load model on startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    model_svc: KNNModelService = app.state.model_service
    try:
        model_svc.load_model()
        logger.info("✅ Model KNN berhasil dimuat saat startup.")
    except FileNotFoundError:
        logger.warning(
            "⚠️  Belum ada model tersimpan. "
            "Jalankan POST /api/v1/train untuk melatih model terlebih dahulu."
        )
    yield
    logger.info("Server berhenti.")


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------
def create_app() -> FastAPI:
    app = FastAPI(
        title="Face Recognition Attendance – AI Service",
        description=(
            "AI Service berbasis **Haar Cascade** + **KNN** untuk sistem presensi otomatis.\n\n"
            "Mendukung dataset **primer** (data asli) dan **sekunder** (dataset publik / LFW / AT&T) "
            "dalam pipeline training dan evaluasi yang terpisah namun terintegrasi."
        ),
        version="2.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # Singleton model service – dibagikan ke seluruh route via app.state
    app.state.model_service = KNNModelService()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router, prefix="/api/v1")

    @app.get("/", tags=["Health"])
    async def root():
        return {
            "service": "Face Recognition Attendance – AI Service",
            "version": "2.0.0",
            "status": "running",
            "docs": "/docs",
        }

    @app.get("/health", tags=["Health"])
    async def health():
        return {
            "status": "healthy",
            "model_loaded": app.state.model_service.is_loaded(),
        }

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
