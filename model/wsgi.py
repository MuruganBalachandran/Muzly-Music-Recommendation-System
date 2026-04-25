"""
WSGI entry point for gunicorn
"""
import sys
import os

# Add the model directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

from src.api_server import app

if __name__ == "__main__":
    app()
