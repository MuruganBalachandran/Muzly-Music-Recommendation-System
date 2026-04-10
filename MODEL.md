# Model - AI/ML Documentation

## Overview

Python-based AI/ML service for emotion detection and music recommendation using computer vision and deep learning.

---

## Technology Stack

- **Language:** Python 3.8+
- **Framework:** Flask
- **Deep Learning:** TensorFlow/Keras
- **Computer Vision:** OpenCV
- **Image Processing:** PIL, NumPy
- **API:** RESTful Flask API

---

## Project Structure

```
model/
├── src/
│   ├── emotion_detection.py    # Emotion detection logic
│   ├── image_processing.py     # Image preprocessing
│   └── recommendation.py       # Recommendation engine
├── emotion_model/
│   └── best_emotion_model.h5   # Trained emotion model
├── data/                        # Training/test data
├── test/                        # Test scripts
├── api_server.py                # Flask API server
├── app.py                       # Main application
├── migrate_mongo.py             # MongoDB migration script
├── .gitignore                   # Git ignore rules
└── README.md                    # Model documentation
```

---

## Emotion Detection Model

### Architecture
- **Type:** Convolutional Neural Network (CNN)
- **Input:** 48x48 grayscale images
- **Output:** 7 emotion classes

### Emotion Classes
1. Happy
2. Sad
3. Angry
4. Disgust
5. Fear
6. Surprise
7. Neutral

### Model Performance
- **Accuracy:** ~65-70% on test set
- **Training Data:** FER2013 dataset
- **Framework:** TensorFlow/Keras

---

## API Endpoints

### Emotion Detection
```
POST /detect-emotion
Content-Type: multipart/form-data

Body:
- image: File (JPEG/PNG)

Response:
{
  "emotion": "happy",
  "confidence": 0.85,
  "all_predictions": {
    "happy": 0.85,
    "neutral": 0.10,
    "surprise": 0.05
  }
}
```

### Music Recommendation
```
POST /recommend
Content-Type: application/json

Body:
{
  "emotion": "happy",
  "context": "party",
  "language": "english"
}

Response:
{
  "recommendations": [
    {
      "songname": "Happy Song",
      "artist": "Artist Name",
      "emotion": "happy",
      "score": 0.95
    }
  ]
}
```

### Health Check
```
GET /health

Response:
{
  "status": "healthy",
  "model_loaded": true
}
```

---

## Image Processing Pipeline

### 1. Image Upload
- Accept JPEG/PNG formats
- Maximum file size: 10MB
- Validate image format

### 2. Preprocessing
```python
def preprocess_image(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Resize to 48x48
    resized = cv2.resize(gray, (48, 48))
    
    # Normalize pixel values
    normalized = resized / 255.0
    
    # Reshape for model input
    return normalized.reshape(1, 48, 48, 1)
```

### 3. Face Detection
- Haar Cascade classifier
- Detect faces in image
- Extract face region

### 4. Emotion Prediction
- Feed preprocessed image to CNN
- Get probability distribution
- Return top emotion

---

## Recommendation Engine

### Algorithm
1. **Emotion Matching:** Match detected emotion with song emotions
2. **Context Analysis:** Consider user context (time, activity)
3. **Collaborative Filtering:** Use user preferences
4. **Scoring:** Combine multiple factors

### Scoring Formula
```python
score = (
    emotion_match * 0.5 +
    context_match * 0.3 +
    user_preference * 0.2
)
```

---

## Model Training

### Dataset
- **Source:** FER2013 (Facial Expression Recognition)
- **Size:** 35,887 images
- **Split:** 80% train, 20% validation

### Training Configuration
```python
{
    "epochs": 50,
    "batch_size": 64,
    "optimizer": "Adam",
    "learning_rate": 0.001,
    "loss": "categorical_crossentropy",
    "metrics": ["accuracy"]
}
```

### Data Augmentation
- Random rotation (±15°)
- Horizontal flip
- Zoom (±10%)
- Brightness adjustment

---

## Flask API Server

### Configuration
```python
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB
app.config['UPLOAD_FOLDER'] = 'uploads/'
```

### CORS Configuration
```python
CORS(app, origins=[
    'http://localhost:8080',
    'http://127.0.0.1:8080'
])
```

### Error Handling
- 400: Bad Request (invalid image)
- 413: Payload Too Large
- 500: Internal Server Error

---

## Environment Setup

### Requirements
```txt
flask==2.3.0
tensorflow==2.13.0
opencv-python==4.8.0
numpy==1.24.0
pillow==10.0.0
flask-cors==4.0.0
pymongo==4.5.0
```

### Installation
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## Running the Server

### Development
```bash
python api_server.py
```
Runs on `http://127.0.0.1:8000`

### Production
```bash
gunicorn -w 4 -b 0.0.0.0:8000 api_server:app
```

---

## MongoDB Integration

### Connection
```python
from pymongo import MongoClient

client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['muzly']
songs_collection = db['songs']
```

### Song Schema
```python
{
    "songname": str,
    "artist": str,
    "emotion": str,
    "language": str,
    "genre": str,
    "image": str,
    "audio": bytes
}
```

---

## Testing

### Unit Tests
```bash
python -m pytest test/
```

### Manual Testing
```bash
# Test emotion detection
curl -X POST http://127.0.0.1:8000/detect-emotion \
  -F "image=@test_image.jpg"

# Test recommendation
curl -X POST http://127.0.0.1:8000/recommend \
  -H "Content-Type: application/json" \
  -d '{"emotion":"happy","language":"english"}'
```

---

## Performance Optimization

### Model Optimization
- Model quantization
- TensorFlow Lite conversion
- Batch prediction

### Caching
- Cache model predictions
- Redis for session storage
- Image preprocessing cache

### Async Processing
- Queue-based processing
- Celery for background tasks
- WebSocket for real-time updates

---

## Error Handling

### Common Errors
```python
class ModelError(Exception):
    """Base exception for model errors"""
    pass

class ImageProcessingError(ModelError):
    """Error in image processing"""
    pass

class PredictionError(ModelError):
    """Error in model prediction"""
    pass
```

---

## Logging

### Configuration
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api_server.log'),
        logging.StreamHandler()
    ]
)
```

---

## Security

### Input Validation
- File type validation
- File size limits
- Image format verification
- Malware scanning

### API Security
- Rate limiting
- API key authentication
- CORS configuration
- Input sanitization

---

## Monitoring

### Metrics
- Request count
- Response time
- Error rate
- Model accuracy
- Resource usage

### Health Checks
```python
@app.route('/health')
def health_check():
    return {
        'status': 'healthy',
        'model_loaded': model is not None,
        'uptime': get_uptime()
    }
```

---

## Deployment

### Docker
```dockerfile
FROM python:3.8-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "api_server:app"]
```

### Environment Variables
```env
FLASK_ENV=production
MODEL_PATH=emotion_model/best_emotion_model.h5
MONGO_URI=mongodb://127.0.0.1:27017/muzly
LOG_LEVEL=INFO
```

---

## Future Enhancements

- [ ] Multi-face detection
- [ ] Real-time video emotion detection
- [ ] Advanced recommendation algorithms
- [ ] Model retraining pipeline
- [ ] A/B testing framework
- [ ] Performance monitoring dashboard

---

## Troubleshooting

### Common Issues

**Issue:** Model not loading
**Solution:** Check model file path and TensorFlow version

**Issue:** Low prediction accuracy
**Solution:** Ensure proper image preprocessing

**Issue:** High memory usage
**Solution:** Implement batch processing and caching

---

## Contributing

1. Follow PEP 8 style guide
2. Add type hints
3. Write unit tests
4. Document all functions
5. Update requirements.txt

---

## License

Proprietary - Muzly.AI
