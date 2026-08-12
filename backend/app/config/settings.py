import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SiLAP"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///../data/database/silap.db"
    
    # Local Installation Paths
    LOCAL_IDENTITY_PATH: str = "../local/installation/identity.json"

    # Security (Default, should be updated for prod but this is a local app)
    SECRET_KEY: str = "silap_local_secret_placeholder_replace_in_prod"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days for local app

    class Config:
        case_sensitive = True
        
settings = Settings()
