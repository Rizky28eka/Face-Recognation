import os
import cv2
import numpy as np
import requests
import time
import random

def download_synthetic_face(output_path):
    """
    Downloads a realistic synthetic face from thispersondoesnotexist.com
    """
    url = "https://thispersondoesnotexist.com"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Error downloading face: {e}")
    return False

def augment_image(image):
    """
    Applies random augmentations to an image
    """
    aug_type = random.choice(['rotate', 'brightness', 'flip', 'noise', 'blur', 'none'])
    
    if aug_type == 'rotate':
        angle = random.uniform(-15, 15)
        h, w = image.shape[:2]
        M = cv2.getRotationMatrix2D((w/2, h/2), angle, 1)
        return cv2.warpAffine(image, M, (w, h))
    
    elif aug_type == 'brightness':
        factor = random.uniform(0.7, 1.3)
        return cv2.convertScaleAbs(image, alpha=factor, beta=0)
    
    elif aug_type == 'flip':
        return cv2.flip(image, 1)
    
    elif aug_type == 'noise':
        noise = np.random.normal(0, 5, image.shape).astype(np.uint8)
        return cv2.add(image, noise)
    
    elif aug_type == 'blur':
        return cv2.GaussianBlur(image, (5, 5), 0)
    
    return image

def generate_user_dataset(user_id, num_samples=50):
    user_dir = f"dataset/{user_id}"
    os.makedirs(user_dir, exist_ok=True)
    
    base_img_path = os.path.join(user_dir, "base_face.jpg")
    
    print(f"Downloading base face for {user_id}...")
    if not download_synthetic_face(base_img_path):
        print(f"Failed to download image for {user_id}. Skipping.")
        return

    base_img = cv2.imread(base_img_path)
    if base_img is None:
        return

    print(f"Generating {num_samples} augmented samples for {user_id}...")
    for i in range(num_samples):
        aug_img = augment_image(base_img)
        sample_path = os.path.join(user_dir, f"sample_{i}.jpg")
        cv2.imwrite(sample_path, aug_img)
        
    # Remove the base face to keep only augmented ones if desired, or keep it
    print(f"Done for {user_id}")

if __name__ == "__main__":
    # Define users
    users = ["user_1_rizky", "user_2_eka", "user_3_budi"]
    
    for user in users:
        generate_user_dataset(user, num_samples=50)
        # Sleep a bit to be polite to the server and avoid identical images
        time.sleep(2)
