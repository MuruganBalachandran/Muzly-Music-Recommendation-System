import uvicorn
from src.config import PORT

if __name__ == '__main__':
    # We moved the main code to src/api_server.py for modularity.
    # This acts as an entry point to keep your old command working!
    uvicorn.run("src.api_server:app", host='127.0.0.1', port=PORT, reload=True)
