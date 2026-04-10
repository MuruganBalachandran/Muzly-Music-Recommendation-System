from typing import Optional
import requests

def get_auto_location():
    """Return a default location (Coimbatore) — mirrors Streamlit app behavior."""
    return { 'lat': 11.0168, 'lon': 76.9558, 'city': 'Coimbatore', 'region': 'Tamil Nadu', 'country': 'IN' }

def get_weather(api_key: Optional[str], location: dict) -> dict:
    """Fetch weather from OpenWeatherMap when an API key is available, otherwise return defaults."""
    WEATHER_MAPPING = {
        'clear': 'clear', 'clouds': 'cloudy', 'rain': 'rain', 'drizzle': 'rain', 'thunderstorm': 'rain',
        'snow': 'cloudy', 'mist': 'cloudy', 'smoke': 'cloudy', 'haze': 'cloudy', 'dust': 'cloudy',
        'fog': 'cloudy', 'sand': 'cloudy', 'ash': 'cloudy', 'squall': 'rain', 'tornado': 'cloudy'
    }

    # Defaults
    default = { 'climate': 'clear', 'temp': 25.0, 'description': 'Clear Sky', 'humidity': 65, 'wind_speed': 3.5 }

    if not api_key or not location:
        return default

    try:
        lat = location.get('lat')
        lon = location.get('lon')
        if lat is None or lon is None:
            return default
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        resp = requests.get(url, timeout=8)
        if resp.status_code != 200:
            return default
        data = resp.json()
        cond = data.get('weather', [{}])[0].get('main','').lower()
        climate = WEATHER_MAPPING.get(cond, 'clear')
        temp = data.get('main', {}).get('temp')
        if temp is None:
            temp = default['temp']
        else:
            temp = max(-50, min(60, float(temp)))
        return {
            'climate': climate,
            'temp': round(temp, 1),
            'description': data.get('weather', [{}])[0].get('description','').title(),
            'humidity': data.get('main', {}).get('humidity', 0),
            'wind_speed': data.get('wind', {}).get('speed', 0)
        }
    except Exception:
        return default
