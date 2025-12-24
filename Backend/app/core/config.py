import os
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", extra="ignore")
    
    PROJECT_NAME: str = "Nagar Alert Hub"
    API_PREFIX: str = "/api/v1"
    
    # Google API Keys
    GOOGLE_MAPS_API_KEY: str = ""
    GOOGLE_GEMINI_API_KEY: str = ""
    
    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = "app/core/serviceAccountKey.json"
    FIREBASE_DATABASE_URL: str = ""

    # Green-API Credentials (WhatsApp)
    GREEN_API_ID_INSTANCE: str = ""
    GREEN_API_API_TOKEN: str = ""

    # Extra configs
    DEBUG: bool = False
    GOOGLE_APPLICATION_CREDENTIALS: str = ""

settings = Settings()