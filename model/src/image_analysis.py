"""
Heuristic-based image analysis fallback when ML models are unavailable.
Provides basic emotion, context, and climate predictions based on image properties.
"""
import io
from PIL import Image
from typing import Dict, Optional


def analyze_image_bytes(image_bytes: bytes) -> Dict[str, str]:
    """
    Analyze image bytes and return heuristic predictions for emotion, context, and climate.
    This is a fallback when TensorFlow/ML models are unavailable.
    
    Args:
        image_bytes: Raw image bytes
        
    Returns:
        Dictionary with keys: emotion, context, climate
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Get image properties
        width, height = img.size
        pixels = img.load()
        
        # Calculate average brightness and color distribution
        brightness_sum = 0
        red_sum = 0
        green_sum = 0
        blue_sum = 0
        pixel_count = 0
        
        # Sample pixels (for performance, don't check every pixel)
        step = max(1, width // 50)  # Sample ~2500 pixels max
        for x in range(0, width, step):
            for y in range(0, height, step):
                r, g, b = pixels[x, y][:3]  # Get RGB, ignore alpha if present
                brightness_sum += (r + g + b) // 3
                red_sum += r
                green_sum += g
                blue_sum += b
                pixel_count += 1
        
        avg_brightness = brightness_sum // pixel_count if pixel_count > 0 else 128
        avg_red = red_sum // pixel_count if pixel_count > 0 else 128
        avg_green = green_sum // pixel_count if pixel_count > 0 else 128
        avg_blue = blue_sum // pixel_count if pixel_count > 0 else 128
        
        # Heuristic: Predict emotion based on brightness and color
        emotion = _predict_emotion_heuristic(avg_brightness, avg_red, avg_green, avg_blue)
        
        # Heuristic: Predict context based on image properties
        context = _predict_context_heuristic(avg_brightness, width, height)
        
        # Heuristic: Predict climate based on brightness and color
        climate = _predict_climate_heuristic(avg_brightness, avg_red, avg_green, avg_blue)
        
        return {
            'emotion': emotion,
            'context': context,
            'climate': climate
        }
    except Exception:
        # Fallback to neutral defaults if anything fails
        return {
            'emotion': 'neutral',
            'context': 'outdoor',
            'climate': 'clear'
        }


def _predict_emotion_heuristic(brightness: int, red: int, green: int, blue: int) -> str:
    """
    Predict emotion based on image brightness and color distribution.
    
    Heuristics:
    - Very bright: happy
    - Bright with warm colors: happy
    - Dark: sad
    - Dark with cool colors: fear
    - Neutral brightness: neutral
    """
    if brightness > 180:
        if red > green and red > blue:
            return 'happy'
        return 'happy'
    elif brightness < 80:
        if blue > red and blue > green:
            return 'fear'
        return 'sad'
    elif brightness < 120:
        if red > green and red > blue:
            return 'angry'
        return 'sad'
    else:
        return 'neutral'


def _predict_context_heuristic(brightness: int, width: int, height: int) -> str:
    """
    Predict context (location type) based on image properties.
    
    Heuristics:
    - Very bright: outdoor/beach
    - Moderate brightness: normal/home
    - Dark: indoor/party
    - Aspect ratio considerations
    """
    aspect_ratio = width / height if height > 0 else 1
    
    if brightness > 170:
        return 'beach'
    elif brightness > 140:
        return 'outdoor'
    elif brightness < 100:
        if aspect_ratio > 1.3:
            return 'concert'
        return 'party'
    else:
        return 'home'


def _predict_climate_heuristic(brightness: int, red: int, green: int, blue: int) -> str:
    """
    Predict climate/weather based on image brightness and color.
    
    Heuristics:
    - Very bright: clear/sunny
    - Bright with blue: clear sky
    - Moderate brightness: cloudy
    - Dark: night/evening
    - Warm colors: sunset/sunrise
    """
    if brightness > 180:
        if blue > red and blue > green:
            return 'clear'
        return 'clear'
    elif brightness > 150:
        if blue > red and blue > green:
            return 'clear'
        return 'cloudy'
    elif brightness > 100:
        return 'cloudy'
    elif brightness > 60:
        if red > green and red > blue:
            return 'clear'  # Sunset/sunrise
        return 'cloudy'
    else:
        return 'night'
