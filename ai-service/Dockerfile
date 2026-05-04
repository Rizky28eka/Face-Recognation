FROM python:3.11-slim

# Install system dependencies for OpenCV and psutil
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Ensure dataset and model directories exist
RUN mkdir -p dataset/train dataset/val dataset/test dataset/logs models

EXPOSE 8088

# Use uvicorn to run the FastAPI app
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8088"]
