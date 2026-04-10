import os

# Root of the model directory
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

DATA_DIR = os.path.join(BASE_DIR, 'data')
SONGS_DIR = os.path.join(DATA_DIR, 'songs')
SONGS_CSV_PATH = os.path.join(DATA_DIR, 'songs.csv')

MODEL_DIR = os.path.join(BASE_DIR, 'emotion_model')
BEST_EMOTION_MODEL_PATH = os.path.join(MODEL_DIR, 'best_emotion_model.h5')
