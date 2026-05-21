import os
import requests
import cv2
import numpy as np
import random
from time import sleep

# Configuration
URL = "https://thispersondoesnotexist.com/"
DATASET_DIR = "/Users/rizky28eka/Development/Fullstack/Face-Recognation/ai-service/dataset/train"
NUM_FACES = 5
AUGMENTATIONS_PER_FACE = 5

def download_image(url, save_path):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Error downloading: {e}")
    return False

def augment_image(image, index):
    """
    Apply various augmentations: Flip, Rotate, Brightness, Noise, Zoom.
    """
    h, w = image.shape[:2]
    
    if index == 0: # Horizontal Flip
        return cv2.flip(image, 1)
    
    elif index == 1: # Rotate
        angle = random.choice([-15, -10, 10, 15])
        M = cv2.getRotationMatrix2D((w/2, h/2), angle, 1)
        return cv2.warpAffine(image, M, (w, h))
    
    elif index == 2: # Brightness
        value = random.randint(-50, 50)
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        v = cv2.add(v, value)
        v[v > 255] = 255
        v[v < 0] = 0
        final_hsv = cv2.merge((h, s, v))
        return cv2.cvtColor(final_hsv, cv2.COLOR_HSV2BGR)
    
    elif index == 3: # Gaussian Noise
        noise = np.random.normal(0, 15, image.shape).astype(np.uint8)
        return cv2.add(image, noise)
    
    elif index == 4: # Zoom/Crop
        zoom_factor = 0.9
        new_h, new_w = int(h * zoom_factor), int(w * zoom_factor)
        start_h, start_w = (h - new_h) // 2, (w - new_w) // 2
        cropped = image[start_h:start_h+new_h, start_w:start_w+new_w]
        return cv2.resize(cropped, (w, h))
    
    return image

def main():
    if not os.path.exists(DATASET_DIR):
        os.makedirs(DATASET_DIR)
        print(f"Created directory: {DATASET_DIR}")

    for i in range(1, NUM_FACES + 1):
        user_name = f"synthetic_user_{i}"
        user_dir = os.path.join(DATASET_DIR, user_name)
        os.makedirs(user_dir, exist_ok=True)
        
        orig_path = os.path.join(user_dir, "original.jpg")
        print(f"Downloading face {i}/{NUM_FACES} from thispersondoesnotexist.com...")
        
        if download_image(URL, orig_path):
            img = cv2.imread(orig_path)
            if img is None:
                print(f"Failed to read downloaded image {orig_path}")
                continue
                
            print(f"Generating {AUGMENTATIONS_PER_FACE} augmentations for {user_name}...")
            for j in range(AUGMENTATIONS_PER_FACE):
                aug_img = augment_image(img, j)
                aug_path = os.path.join(user_dir, f"aug_{j+1}.jpg")
                cv2.imwrite(aug_path, aug_img)
            
            # Avoid hitting the server too fast
            sleep(1)
        else:
            print(f"Failed to download image {i}")

    print("\nProcessing complete! Added 5 synthetic users with 5 augmentations each.")

if __name__ == "__main__":
    main()
