from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    google_api_key: str
    elevenlabs_api_key: str = ""
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
