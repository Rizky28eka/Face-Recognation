from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
import os

class Settings(BaseSettings):
    # API Configuration
    APP_NAME: str = "AI Face Engine"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8088
    DEBUG: bool = True

    # Path Configuration
    DATASET_PATH: str = "dataset"
    MODEL_PATH: str = "models/knn_model.pkl"
    METRICS_PATH: str = "models/metrics.json"
    CASCADE_PATH: str = "models/haarcascade_frontalface_default.xml"

    # Face Processing Configuration
    RESIZE_WIDTH: int = 100
    RESIZE_HEIGHT: int = 100
    RECOGNITION_THRESHOLD: float = 0.5

    # Training Configuration
    KNN_NEIGHBORS: int = 3
    TEST_SIZE: float = 0.2
    RANDOM_STATE: int = 42

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache()
def get_settings():
    return Settings()

# Global settings instance
settings = get_settings()
