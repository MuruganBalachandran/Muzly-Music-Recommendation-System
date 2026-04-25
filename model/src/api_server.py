from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from src.config import SONGS_DIR, OPENWEATHER_API_KEY, PORT
from src.recommender import load_songs_df, recommend_songs_from_df
from src.image_analysis import analyze_image_bytes
# Import specific ML modules
from src.ml_models import detect_emotion_from_bytes, classify_scene_from_pil, predict_image_weather_from_pil
from src.weather import get_auto_location, get_weather
from src.middleware import LoggingAndErrorMiddleware

app = FastAPI(title="Muzly Minimal API")

# Add custom logging and error handling middleware
app.add_middleware(LoggingAndErrorMiddleware)

# Allow local dev origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if os.path.exists(SONGS_DIR):
    app.mount("/songs", StaticFiles(directory=SONGS_DIR), name="songs")
    app.mount("/audio", StaticFiles(directory=SONGS_DIR), name="audio")

@app.get('/songs')
def list_songs(limit: int = 1000):
    df = load_songs_df()
    if df is None:
        raise HTTPException(status_code=500, detail='Songs CSV not found or unreadable')
    return df.head(limit).to_dict(orient='records')

@app.post('/recommend/upload')
async def recommend_upload(file: UploadFile = File(...), limit: int = 10):
    df = load_songs_df()
    if df is None:
        raise HTTPException(status_code=500, detail='Songs CSV not found or unreadable')

    try:
        content = await file.read()
    except Exception:
        content = None

    if content:
        ml_emotion = detect_emotion_from_bytes(content)
        ml_context = classify_scene_from_pil(content)
        ml_climate = predict_image_weather_from_pil(content)
        used_ml = False
        user_emotion = None
        user_context = None
        user_climate = None
        
        if ml_emotion is not None:
            user_emotion = ml_emotion.get('emotion', 'neutral')
            used_ml = True
        if ml_context is not None:
            user_context = ml_context
            used_ml = True
        if ml_climate is not None:
            user_climate = ml_climate
            used_ml = True
            
        heur = analyze_image_bytes(content)
        if not user_emotion:
            user_emotion = heur.get('emotion', 'neutral')
        if not user_context:
            user_context = heur.get('context', 'outdoor')
        if not user_climate:
            user_climate = heur.get('climate', 'clear')
    else:
        user_emotion = 'neutral'
        user_context = 'normal'
        user_climate = 'clear'

    user_location = get_auto_location()
    weather = get_weather(OPENWEATHER_API_KEY, user_location)

    results = recommend_songs_from_df(df, user_emotion=user_emotion, user_context=user_context, user_climate=user_climate, user_location=user_location, n=limit)

    analysis_payload = { 'emotion': user_emotion, 'context': user_context, 'climate': user_climate }
    analysis_payload['source'] = 'ml' if ('used_ml' in locals() and used_ml) else 'heuristic'
    if isinstance(ml_emotion, dict) and ml_emotion.get('confidence') is not None:
        analysis_payload['confidence'] = float(ml_emotion.get('confidence'))

    return {
        'analysis': analysis_payload,
        'location': user_location,
        'weather': weather,
        'recommendations': results
    }

@app.get('/recommend')
def recommend(emotion: str = 'neutral', context: str = 'normal', climate: str = 'clear', lat: float = 11.0168, lon: float = 76.9558, region: str = 'Tamil Nadu', country: str = 'IN', limit: int = 8):
    df = load_songs_df()
    if df is None:
        raise HTTPException(status_code=500, detail='Songs CSV not found or unreadable')

    location = { 'lat': lat, 'lon': lon, 'region': region, 'country': country }
    results = recommend_songs_from_df(df, user_emotion=emotion, user_context=context, user_climate=climate, user_location=location, n=limit)
    return results

if __name__ == '__main__':
    import uvicorn
    # when run from the `model` dir with `python -m src.api_server`
    uvicorn.run("src.api_server:app", host='127.0.0.1', port=PORT, reload=True)
