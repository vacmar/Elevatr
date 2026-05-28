from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5433/elevatr"
    jwt_secret: str = "change-me"
    jwt_access_token_expires_minutes: int = 30
    jwt_refresh_token_expires_days: int = 14
    upload_dir: str = "backend/app/uploads"


settings = Settings()
