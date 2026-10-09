import cv2
import numpy as np
import os

def process_evidence_image(image_path: str, blur_threshold: float = 100.0):
    if not os.path.exists(image_path):
        return {"error": "Image not found"}
        
    image = cv2.imread(image_path)
    if image is None:
        return {"error": "Invalid image format"}
        
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # 1. Laplacian Variance for Blur Detection
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    is_blurry = variance < blur_threshold
    
    enhanced_path = image_path
    if is_blurry:
        # 2. Histogram Equalization
        equalized = cv2.equalizeHist(gray)
        # 3. Unsharp Masking
        gaussian = cv2.GaussianBlur(image, (9, 9), 10.0)
        enhanced = cv2.addWeighted(image, 1.5, gaussian, -0.5, 0)
        enhanced_path = image_path.replace(".jpg", "_enhanced.jpg")
        cv2.imwrite(enhanced_path, enhanced)
        
    return {
        "blur_score": float(variance),
        "is_blurry": bool(is_blurry),
        "enhanced_url": enhanced_path
    }
