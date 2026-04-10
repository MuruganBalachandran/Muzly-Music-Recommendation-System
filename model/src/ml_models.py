import os
import cv2
import numpy as np
from PIL import Image
import io
from typing import Optional
from src.config import BEST_EMOTION_MODEL_PATH

_emotion_model = None
_emotion_labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
_clip_model = None
_clip_processor = None

def load_emotion_model_resource():
    global _emotion_model
    if _emotion_model is not None:
        return _emotion_model
    try:
        from tensorflow.keras.models import load_model
        if os.path.exists(BEST_EMOTION_MODEL_PATH):
            _emotion_model = load_model(BEST_EMOTION_MODEL_PATH)
            return _emotion_model
    except Exception:
        _emotion_model = None
    return None

def load_clip_model_resource():
    global _clip_model, _clip_processor
    if _clip_model is not None and _clip_processor is not None:
        return _clip_model, _clip_processor
    try:
        from transformers import CLIPProcessor, CLIPModel
        _clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        _clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        return _clip_model, _clip_processor
    except Exception:
        _clip_model = None
        _clip_processor = None
    return None, None

def detect_emotion_from_bytes(image_bytes: bytes) -> dict:
    """Try to detect emotion using the keras model. Return dict or None if not available."""
    model = load_emotion_model_resource()
    if model is None:
        return None
    try:
        arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
        if len(faces) == 0:
            return {'emotion': 'neutral', 'confidence': 0.0}
        emotions = []
        for (x, y, w, h_face) in faces:
            roi = gray[y:y+h_face, x:x+w]
            roi = cv2.resize(roi, (48, 48))
            roi = roi.astype('float32') / 255.0
            roi = np.expand_dims(roi, axis=(0, -1))
            preds = model.predict(roi, verbose=0)
            idx = int(np.argmax(preds))
            emotions.append((_emotion_labels[idx], float(np.max(preds))))
        best_emotion, best_conf = max(emotions, key=lambda x: x[1])
        return {'emotion': best_emotion, 'confidence': best_conf}
    except Exception:
        return None

def classify_scene_from_pil(image_bytes: bytes) -> Optional[str]:
    clip_m, clip_p = load_clip_model_resource()
    if clip_m is None or clip_p is None:
        return None
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        context_categories = [
            "party", "concert", "home", "beach", "gym", "roadtrip",
            "festival", "restaurant", "office", "park", "normal"
        ]
        inputs = clip_p(text=context_categories, images=img, return_tensors="pt", padding=True)
        outputs = clip_m(**inputs)
        probs = outputs.logits_per_image.softmax(dim=1)[0].detach().numpy()
        pred_idx = int(probs.argmax())
        if float(probs.max()) < 0.3:
            return "normal"
        return context_categories[pred_idx]
    except Exception:
        return None

def predict_image_weather_from_pil(image_bytes: bytes) -> Optional[str]:
    clip_m, clip_p = load_clip_model_resource()
    if clip_m is None or clip_p is None:
        return None
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        climate_descriptors = [
            "bright daylight scene", "sunny outdoor scene", "clear bright day",
            "dark night scene", "low light environment", "evening darkness",
            "indoor lighting", "outdoor natural light", "artificial lighting",
            "rainy scene", "cloudy weather", "foggy atmosphere", "clear sky",
            "sunrise scene", "sunset scene", "midday bright", "evening scene"
        ]
        inputs = clip_p(text=climate_descriptors, images=img, return_tensors="pt", padding=True)
        outputs = clip_m(**inputs)
        probs = outputs.logits_per_image.softmax(dim=1)[0].detach().numpy()
        pred_idx = int(probs.argmax())
        if float(probs.max()) < 0.3:
            return "clear"
        climate_mapping = {
            "bright daylight scene": "clear",
            "sunny outdoor scene": "clear",
            "clear bright day": "clear",
            "dark night scene": "night",
            "low light environment": "night",
            "evening darkness": "night",
            "indoor lighting": "clear",
            "outdoor natural light": "clear",
            "artificial lighting": "clear",
            "rainy scene": "rain",
            "cloudy weather": "cloudy",
            "foggy atmosphere": "cloudy",
            "clear sky": "clear",
            "sunrise scene": "clear",
            "sunset scene": "clear",
            "midday bright": "clear",
            "evening scene": "cloudy"
        }
        return climate_mapping.get(climate_descriptors[pred_idx], "clear")
    except Exception:
        return None
