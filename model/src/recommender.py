import os
import pandas as pd
from typing import Optional
from src.config import SONGS_CSV_PATH, MONGO_URI

LANGUAGE_MAPPING = {
    "Tamil Nadu": {"primary": "Tamil", "fallbacks": ["English"]},
    "Kerala": {"primary": "Malayalam", "fallbacks": ["Tamil", "English"]},
    "Andhra Pradesh": {"primary": "Telugu", "fallbacks": ["Tamil", "English"]},
    "Telangana": {"primary": "Telugu", "fallbacks": ["Tamil", "English"]},
    "Karnataka": {"primary": "Kannada", "fallbacks": ["Tamil", "English"]}
}

CLIMATE_MAPPING = {
    'sunny': {'emotions': ['happy', 'romantic', 'surprise'], 'vibe': 'bright, energetic, outdoor vibe'},
    'clear': {'emotions': ['happy', 'neutral', 'proud', 'party'], 'vibe': 'lively, festival, confidence'},
    'rain': {'emotions': ['sad', 'fear', 'romantic'], 'vibe': 'slow, emotional, soothing'},
    'cloudy': {'emotions': ['neutral', 'fear', 'romantic'], 'vibe': 'calm, reflective, roadtrip'},
    'night': {'emotions': ['fear', 'sad', 'romantic'], 'vibe': 'deep, emotional, introspective'}
}

# Simple cache to avoid hitting MongoDB for every recommendation
CACHE = {
    'df': None,
    'last_updated': 0
}

def load_songs_df() -> Optional[pd.DataFrame]:
    import time
    now = time.time()
    
    # Refresh cache every 5 minutes
    if CACHE['df'] is not None and (now - CACHE['last_updated'] < 300):
        return CACHE['df']

    try:
        from pymongo import MongoClient
        client = MongoClient(MONGO_URI)
        db = client["muzly"]
        col = db["songs"]
        
        # EXCLUDING audioData and album images from the recommendation scan to save RAM
        cursor = col.find({}, {'_id': 0, 'audioData': 0})
        records = list(cursor)
        
        if not records:
            if os.path.exists(SONGS_CSV_PATH):
                df = pd.read_csv(SONGS_CSV_PATH)
                CACHE['df'] = df.fillna('')
                CACHE['last_updated'] = now
                return CACHE['df']
            else:
                return None
                
        df = pd.DataFrame(records).fillna('')
        CACHE['df'] = df
        CACHE['last_updated'] = now
        return df
    except Exception as e:
        print(f"ERROR connecting to MongoDB: {e}")
        if os.path.exists(SONGS_CSV_PATH):
            df = pd.read_csv(SONGS_CSV_PATH)
            return df.fillna('')
        return None

def get_language_preferences(location: dict):
    region = (location or {}).get('region', '')
    if region in LANGUAGE_MAPPING:
        return LANGUAGE_MAPPING[region]
    return {"primary": "English", "fallbacks": ["Hindi", "Tamil", "English"]}

def recommend_songs_from_df(df: pd.DataFrame, user_emotion: str = 'neutral', user_context: str = 'normal', user_climate: str = 'clear', user_location: dict = None, n: int = 8):
    if df is None or df.empty:
        return []

    for col in ['language', 'emotion', 'context', 'image_climate']:
        if col in df.columns:
            df[col] = df[col].fillna('').astype(str)

    # Instead of strict filtering that narrows results too early and relies purely on fallbacks,
    # we score the ENTIRE dataset so recommendations naturally bubble up that match all conditions best.
    
    # 1. Filter by language (strict criteria to match region)
    lang_prefs = get_language_preferences(user_location or {})
    primary_lang = lang_prefs['primary']
    fallback_langs = lang_prefs.get('fallbacks', [])
    valid_langs = [primary_lang] + fallback_langs

    # Narrow down to only accepted languages
    if 'language' in df.columns:
        valid_df = df[df['language'].isin(valid_langs)].copy()
        if valid_df.empty:
            valid_df = df.copy()  # fallback if entirely missing
    else:
        valid_df = df.copy()

    # Pre-calculate compatible emotions mapping to scale scores
    emotion_groups_score = {
        'happy': ['happy', 'surprise', 'neutral'],
        'sad': ['sad', 'fear', 'disgust'],
        'anger': ['anger', 'disgust', 'fear'],
        'disgust': ['disgust', 'anger', 'fear'],
        'fear': ['fear', 'sad', 'neutral'],
        'surprise': ['surprise', 'happy', 'neutral'],
        'neutral': ['neutral', 'happy', 'calm']
    }
    compatible_emotions = emotion_groups_score.get((user_emotion or '').lower(), ['neutral', 'happy'])

    valid_df['score'] = 0

    # Increase randomness to avoid repeating exact set of 10 songs on identical contexts
    # By shuffling before we stable-sort by score, ties are broken randomly.
    valid_df = valid_df.sample(frac=1, random_state=None).reset_index(drop=True)

    emotion_groups_score = {
        'happy': ['happy', 'surprise', 'neutral'],
        'sad': ['sad', 'fear', 'disgust'],
        'anger': ['anger', 'disgust', 'fear'],
        'disgust': ['disgust', 'anger', 'fear'],
        'fear': ['fear', 'sad', 'neutral'],
        'surprise': ['surprise', 'happy', 'neutral'],
        'neutral': ['neutral', 'happy', 'calm']
    }
    compatible_emotions = emotion_groups_score.get((user_emotion or '').lower(), ['neutral', 'happy'])

    for idx, row in valid_df.iterrows():
        score = 0
        if row.get('language') == primary_lang:
            score += 30
        elif row.get('language') in fallback_langs:
            score += 15

        if str(row.get('emotion','')).lower() == (user_emotion or '').lower():
            score += 40
        elif str(row.get('emotion','')).lower() in compatible_emotions:
            score += 25

        if str(row.get('context','')).lower() == (user_context or '').lower():
            score += 20
        elif str(row.get('context','')).lower() in ['home', 'normal']:
            score += 10

        if str(row.get('image_climate','')).lower() == (user_climate or '').lower():
            score += 10
        elif (user_climate or '').lower() in ['clear', 'sunny'] and str(row.get('image_climate','')).lower() in ['clear', 'sunny']:
            score += 5

        valid_df.at[idx, 'score'] = score

    # Uses pd.Series.argsort (via sort_values) and drops score to return dict
    final_recommendations = valid_df.sort_values(by='score', ascending=False)
    return final_recommendations.head(n).to_dict(orient='records')
