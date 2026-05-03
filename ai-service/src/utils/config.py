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

def update_settings(updates: dict):
    global settings
    env_path = ".env"
    
    # Read existing env vars
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if "=" in line and not line.strip().startswith("#"):
                    k, v = line.strip().split("=", 1)
                    env_vars[k] = v

    # Update with new values
    for k, v in updates.items():
        env_vars[k.upper()] = str(v)
        # Update current settings object dynamically
        if hasattr(settings, k.upper()):
            setattr(settings, k.upper(), v)

    # Write back to .env
    with open(env_path, "w") as f:
        for k, v in env_vars.items():
            f.write(f"{k}={v}\n")
    
    # Clear cache so next get_settings() gets new values
    get_settings.cache_clear()
    
    return settings
