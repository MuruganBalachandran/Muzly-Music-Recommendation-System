import os
from dotenv import load_dotenv

# Root of the model directory
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Load environment variables
load_dotenv(os.path.join(BASE_DIR, '.env'))

DATA_DIR = os.path.join(BASE_DIR, 'data')
SONGS_DIR = os.path.join(DATA_DIR, 'songs')
SONGS_CSV_PATH = os.path.join(DATA_DIR, 'songs.csv')

MODEL_DIR = os.path.join(BASE_DIR, 'emotion_model')
BEST_EMOTION_MODEL_PATH = os.path.join(MODEL_DIR, 'best_emotion_model.h5')

# Environment Variables
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017/')
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
PORT = int(os.getenv('PORT', 8001))
