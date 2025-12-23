import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Nagar Alert Hub"
    API_PREFIX: str = "/api/v1"
    
    # Google API Keys
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    GOOGLE_GEMINI_API_KEY: str = os.getenv("GOOGLE_GEMINI_API_KEY", "")
    
    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "app/core/serviceAccountKey.json")
    FIREBASE_DATABASE_URL: str = os.getenv("FIREBASE_DATABASE_URL", "")

    # Extra configs found in .env
    DEBUG: bool = False
    GOOGLE_APPLICATION_CREDENTIALS: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
