"""
Synthetic Face Dataset Generator
Mengunduh wajah sintetis dari thispersondoesnotexist.com,
mengaugmentasi, lalu menyimpan ke struktur dataset train/val/test.
"""

import os
import cv2
import numpy as np
import requests
import time
import random
import logging
import json
import hashlib
from pathlib import Path
from dataclasses import dataclass, asdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Optional
from datetime import datetime

try:
    from tqdm import tqdm
    HAS_TQDM = True
except ImportError:
    HAS_TQDM = False

# ──────────────────────────────────────────────
# KONFIGURASI
# ──────────────────────────────────────────────
@dataclass
class DatasetConfig:
    total_users: int = 20
    samples_per_user: int = 50
    img_size: int = 224
    output_dir: str = "dataset"
    train_ratio: float = 0.7
    val_ratio: float = 0.15
    test_ratio: float = 0.15
    max_retries: int = 5
    retry_delay: float = 2.0
    request_delay: tuple = (2.0, 4.0)   # min, max detik antar request
    max_workers: int = 3                 # thread paralel untuk augmentasi
    quality: int = 95                    # kualitas JPEG (1–100)
    seed: Optional[int] = 42

    def __post_init__(self):
        assert abs(self.train_ratio + self.val_ratio + self.test_ratio - 1.0) < 1e-6, \
            "train + val + test harus = 1.0"


# ──────────────────────────────────────────────
# LOGGING
# ──────────────────────────────────────────────
def setup_logger(log_dir: str) -> logging.Logger:
    os.makedirs(log_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_path = os.path.join(log_dir, f"dataset_gen_{timestamp}.log")

    logger = logging.getLogger("DatasetGen")
    logger.setLevel(logging.DEBUG)

    fmt = logging.Formatter("[%(asctime)s] %(levelname)s — %(message)s", "%H:%M:%S")

    fh = logging.FileHandler(log_path, encoding="utf-8")
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(fmt)

    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    ch.setFormatter(fmt)

    logger.addHandler(fh)
    logger.addHandler(ch)
    return logger


# ──────────────────────────────────────────────
# DOWNLOADER
# ──────────────────────────────────────────────
class FaceDownloader:
    URL = "https://thispersondoesnotexist.com"
    HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    def __init__(self, config: DatasetConfig, logger: logging.Logger):
        self.cfg = config
        self.log = logger
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)

    def download(self) -> Optional[np.ndarray]:
        """Unduh satu gambar dengan retry otomatis."""
        for attempt in range(1, self.cfg.max_retries + 1):
            try:
                resp = self.session.get(self.URL, timeout=15)
                resp.raise_for_status()

                img_array = np.frombuffer(resp.content, np.uint8)
                img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

                if img is None or img.size == 0:
                    raise ValueError("Gambar kosong / gagal decode")

                # Validasi ukuran minimal
                h, w = img.shape[:2]
                if h < 64 or w < 64:
                    raise ValueError(f"Gambar terlalu kecil: {w}x{h}")

                self.log.debug(f"Download OK ({w}x{h})")
                return img

            except Exception as e:
                self.log.warning(f"Attempt {attempt}/{self.cfg.max_retries} gagal: {e}")
                if attempt < self.cfg.max_retries:
                    time.sleep(self.cfg.retry_delay * attempt)

        self.log.error("Semua percobaan download gagal.")
        return None

    def close(self):
        self.session.close()


# ──────────────────────────────────────────────
# AUGMENTASI
# ──────────────────────────────────────────────
class ImageAugmenter:
    def __init__(self, config: DatasetConfig):
        self.cfg = config

    # --- Transformasi geometri ---
    def _flip(self, img: np.ndarray) -> np.ndarray:
        return cv2.flip(img, 1)

    def _rotate(self, img: np.ndarray, angle: float) -> np.ndarray:
        h, w = img.shape[:2]
        M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1.0)
        return cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REFLECT)

    def _translate(self, img: np.ndarray, dx: int, dy: int) -> np.ndarray:
        h, w = img.shape[:2]
        M = np.float32([[1, 0, dx], [0, 1, dy]])
        return cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REFLECT)

    def _zoom(self, img: np.ndarray, factor: float) -> np.ndarray:
        h, w = img.shape[:2]
        ch, cw = h // 2, w // 2
        new_h, new_w = int(h / factor), int(w / factor)
        y1 = max(ch - new_h // 2, 0)
        x1 = max(cw - new_w // 2, 0)
        cropped = img[y1:y1 + new_h, x1:x1 + new_w]
        return cv2.resize(cropped, (w, h))

    # --- Transformasi warna ---
    def _brightness(self, img: np.ndarray, alpha: float, beta: float) -> np.ndarray:
        return cv2.convertScaleAbs(img, alpha=alpha, beta=beta)

    def _gamma(self, img: np.ndarray, gamma: float) -> np.ndarray:
        table = np.array([((i / 255.0) ** gamma) * 255 for i in range(256)], dtype=np.uint8)
        return cv2.LUT(img, table)

    def _channel_shuffle(self, img: np.ndarray) -> np.ndarray:
        ch = list(range(img.shape[2]))
        random.shuffle(ch)
        return img[:, :, ch]

    def _hsv_jitter(self, img: np.ndarray) -> np.ndarray:
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
        hsv[:, :, 1] *= random.uniform(0.7, 1.3)   # saturation
        hsv[:, :, 2] *= random.uniform(0.7, 1.3)   # value
        hsv = np.clip(hsv, 0, 255).astype(np.uint8)
        return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

    # --- Noise & blur ---
    def _gaussian_noise(self, img: np.ndarray, std: float) -> np.ndarray:
        noise = np.random.normal(0, std, img.shape).astype(np.int16)
        return np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    def _salt_pepper(self, img: np.ndarray, amount: float = 0.01) -> np.ndarray:
        out = img.copy()
        n = int(amount * img.size / img.shape[2])
        ys = np.random.randint(0, img.shape[0], n)
        xs = np.random.randint(0, img.shape[1], n)
        out[ys[:n//2], xs[:n//2]] = 255
        out[ys[n//2:], xs[n//2:]] = 0
        return out

    def _blur(self, img: np.ndarray, ksize: int) -> np.ndarray:
        k = ksize if ksize % 2 == 1 else ksize + 1
        return cv2.GaussianBlur(img, (k, k), 0)

    def _sharpen(self, img: np.ndarray) -> np.ndarray:
        kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
        return cv2.filter2D(img, -1, kernel)

    # --- Occlusion ---
    def _cutout(self, img: np.ndarray, n_holes: int = 1, size: int = 30) -> np.ndarray:
        out = img.copy()
        h, w = img.shape[:2]
        for _ in range(n_holes):
            y = random.randint(0, h - size)
            x = random.randint(0, w - size)
            out[y:y+size, x:x+size] = 0
        return out

    # --- Pipeline utama ---
    def augment(self, image: np.ndarray) -> np.ndarray:
        img = image.copy()

        # Geometri
        if random.random() < 0.5:
            img = self._flip(img)
        if random.random() < 0.6:
            img = self._rotate(img, random.uniform(-20, 20))
        if random.random() < 0.3:
            dx, dy = random.randint(-20, 20), random.randint(-20, 20)
            img = self._translate(img, dx, dy)
        if random.random() < 0.3:
            img = self._zoom(img, random.uniform(1.05, 1.3))

        # Warna
        if random.random() < 0.6:
            img = self._brightness(img, random.uniform(0.7, 1.3), random.uniform(-20, 20))
        if random.random() < 0.4:
            img = self._gamma(img, random.uniform(0.6, 1.4))
        if random.random() < 0.4:
            img = self._hsv_jitter(img)

        # Noise & blur
        if random.random() < 0.3:
            img = self._gaussian_noise(img, random.uniform(5, 20))
        if random.random() < 0.15:
            img = self._salt_pepper(img)
        if random.random() < 0.3:
            img = self._blur(img, random.choice([3, 5]))
        if random.random() < 0.2:
            img = self._sharpen(img)

        # Occlusion ringan
        if random.random() < 0.2:
            img = self._cutout(img, n_holes=random.randint(1, 2), size=random.randint(15, 40))

        img = cv2.resize(img, (self.cfg.img_size, self.cfg.img_size))
        return img


# ──────────────────────────────────────────────
# DATASET GENERATOR
# ──────────────────────────────────────────────
class DatasetGenerator:
    def __init__(self, config: DatasetConfig):
        self.cfg = config
        if config.seed is not None:
            random.seed(config.seed)
            np.random.seed(config.seed)

        self.log = setup_logger(os.path.join(config.output_dir, "logs"))
        self.downloader = FaceDownloader(config, self.log)
        self.augmenter = ImageAugmenter(config)
        self.stats = {
            "total_classes": 0,
            "total_images": 0,
            "failed_downloads": 0,
            "splits": {"train": 0, "val": 0, "test": 0},
            "hashes": []
        }

    # Tentukan split untuk tiap index gambar
    def _get_split(self, idx: int, total: int) -> str:
        train_end = int(total * self.cfg.train_ratio)
        val_end = train_end + int(total * self.cfg.val_ratio)
        if idx < train_end:
            return "train"
        elif idx < val_end:
            return "val"
        return "test"

    def _save_image(self, img: np.ndarray, path: str) -> bool:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        params = [cv2.IMWRITE_JPEG_QUALITY, self.cfg.quality]
        success, buf = cv2.imencode(".jpg", img, params)
        if success:
            with open(path, "wb") as f:
                f.write(buf.tobytes())
            return True
        return False

    def _image_hash(self, img: np.ndarray) -> str:
        return hashlib.md5(img.tobytes()).hexdigest()[:12]

    def _generate_class(self, class_idx: int) -> dict:
        class_name = f"synthetic_face_{class_idx:03d}"
        self.log.info(f"▶ [{class_idx}/{self.cfg.total_users}] {class_name}")

        base_img = self.downloader.download()
        if base_img is None:
            self.log.error(f"✗ {class_name}: gagal download, dilewati.")
            return {"class": class_name, "saved": 0, "failed": 1}

        img_hash = self._image_hash(base_img)
        saved = 0
        n = self.cfg.samples_per_user

        indices = list(range(n))
        random.shuffle(indices)

        iter_obj = tqdm(indices, desc=f"  {class_name}", leave=False) if HAS_TQDM else indices

        for j, idx in enumerate(iter_obj):
            split = self._get_split(j, n)
            aug = self.augmenter.augment(base_img)
            fname = f"{img_hash}_{j:04d}.jpg"
            path = os.path.join(self.cfg.output_dir, split, class_name, fname)

            if self._save_image(aug, path):
                saved += 1
                self.stats["splits"][split] += 1
            else:
                self.log.warning(f"  Gagal simpan: {path}")

        self.log.info(f"  ✓ {class_name}: {saved}/{n} gambar tersimpan")
        return {"class": class_name, "saved": saved, "failed": 0, "hash": img_hash}

    def generate(self):
        self.log.info("=" * 55)
        self.log.info("  SYNTHETIC FACE DATASET GENERATOR")
        self.log.info("=" * 55)
        self.log.info(f"  Users     : {self.cfg.total_users}")
        self.log.info(f"  Samples   : {self.cfg.samples_per_user}/user")
        self.log.info(f"  Img size  : {self.cfg.img_size}x{self.cfg.img_size}")
        self.log.info(f"  Split     : {self.cfg.train_ratio}/{self.cfg.val_ratio}/{self.cfg.test_ratio}")
        self.log.info(f"  Output    : {self.cfg.output_dir}/")
        self.log.info("=" * 55)

        results = []
        outer = (
            tqdm(range(1, self.cfg.total_users + 1), desc="Classes", unit="class")
            if HAS_TQDM else range(1, self.cfg.total_users + 1)
        )

        for i in outer:
            result = self._generate_class(i)
            results.append(result)
            self.stats["total_classes"] += 1
            self.stats["total_images"] += result.get("saved", 0)
            self.stats["failed_downloads"] += result.get("failed", 0)

            # Delay sopan agar tidak overload server
            if i < self.cfg.total_users:
                delay = random.uniform(*self.cfg.request_delay)
                self.log.debug(f"  Delay {delay:.1f}s sebelum class berikutnya…")
                time.sleep(delay)

        self._save_metadata(results)
        self._print_summary()
        self.downloader.close()

    def _save_metadata(self, results: list):
        meta = {
            "generated_at": datetime.now().isoformat(),
            "config": asdict(self.cfg),
            "stats": self.stats,
            "classes": results
        }
        path = os.path.join(self.cfg.output_dir, "metadata.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)
        self.log.info(f"  Metadata disimpan → {path}")

    def _print_summary(self):
        s = self.stats
        self.log.info("")
        self.log.info("═" * 45)
        self.log.info("  RINGKASAN DATASET")
        self.log.info("═" * 45)
        self.log.info(f"  Total kelas      : {s['total_classes']}")
        self.log.info(f"  Total gambar     : {s['total_images']}")
        self.log.info(f"  Gagal download   : {s['failed_downloads']}")
        self.log.info(f"  Train            : {s['splits']['train']}")
        self.log.info(f"  Val              : {s['splits']['val']}")
        self.log.info(f"  Test             : {s['splits']['test']}")
        self.log.info(f"  Struktur folder  : {self.cfg.output_dir}/{{train,val,test}}/class/")
        self.log.info("═" * 45)


# ──────────────────────────────────────────────
# ENTRYPOINT
# ──────────────────────────────────────────────
if __name__ == "__main__":
    config = DatasetConfig(
        total_users=20,
        samples_per_user=50,
        img_size=224,
        output_dir="dataset",
        train_ratio=0.70,
        val_ratio=0.15,
        test_ratio=0.15,
        max_retries=5,
        retry_delay=2.0,
        request_delay=(2.0, 4.0),
        quality=95,
        seed=42,
    )

    generator = DatasetGenerator(config)
    generator.generate()