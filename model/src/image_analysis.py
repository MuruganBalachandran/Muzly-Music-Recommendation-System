import cv2
import numpy as np

def analyze_image_bytes(image_bytes: bytes) -> dict:
    """Lightweight heuristics to infer emotion, context, and climate from an image.

    This provides image-dependent variability so recommendations change with uploads
    even if the heavy ML models are not available. Results are heuristic.
    """
    try:
        arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)  # BGR
        if img is None:
            return {"emotion": "neutral", "context": "normal", "climate": "clear"}

        # Quick HSV statistics
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        h = hsv[:, :, 0]
        s = hsv[:, :, 1]
        v = hsv[:, :, 2]
        total = float(h.size)

        blue_mask = (h > 90) & (h < 140)
        green_mask = (h > 35) & (h < 85)
        blue_pct = np.count_nonzero(blue_mask) / total
        green_pct = np.count_nonzero(green_mask) / total
        mean_v = float(np.mean(v))
        mean_s = float(np.mean(s))

        # Emotion heuristic: smile detection using Haar cascades (best-effort)
        emotion = "neutral"
        faces_count = 0
        try:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
            faces_count = len(faces)
            if faces_count > 0:
                x, y, w, h_face = faces[0]
                roi_gray = gray[y:y+h_face, x:x+w]
                smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
                smiles = smile_cascade.detectMultiScale(roi_gray, scaleFactor=1.7, minNeighbors=20)
                if len(smiles) > 0:
                    emotion = "happy"
                else:
                    emotion = "neutral"
        except Exception:
            emotion = "neutral"

        # Edge density — useful for concert/party/road context
        try:
            edges = cv2.Canny(gray, 100, 200)
            edge_count = np.count_nonzero(edges)
            edge_ratio = edge_count / total
        except Exception:
            edge_ratio = 0.0

        # Scene/climate heuristic — improved mapping
        context = 'normal'
        climate = 'clear'

        # Beach / bright blue water
        if blue_pct > 0.20 and mean_v > 90:
            context = 'beach'
            climate = 'clear'
        # Park / greenery
        elif green_pct > 0.20 and mean_v > 70:
            context = 'park'
            climate = 'clear'
        # Night / low brightness
        elif mean_v < 50:
            context = 'night'
            climate = 'night'
        # Home / indoor when faces and low saturation
        elif faces_count > 0 and mean_s < 60:
            context = 'home'
            climate = 'cloudy' if mean_v < 120 else 'clear'
        # Party / festival when high saturation and brightness
        elif mean_s > 120 and mean_v > 140:
            context = 'party'
            climate = 'clear'
        # Concert / busy scenes when many edges and darker
        elif edge_ratio > 0.03 and mean_v < 120:
            context = 'concert'
            climate = 'night' if mean_v < 80 else 'clear'
        # Default outdoor
        else:
            context = 'outdoor'
            climate = 'clear'

        return {"emotion": emotion, "context": context, "climate": climate}
    except Exception:
        return {"emotion": "neutral", "context": "normal", "climate": "clear"}
