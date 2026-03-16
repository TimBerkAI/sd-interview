from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="./.env")

    PG_HOST: str = "localhost"
    PG_PORT: int = 5432
    PG_DB: str = "interview"
    PG_USER: str = "interview"
    PG_PASSWORD: str = "interview"

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.PG_USER}:{self.PG_PASSWORD}@{self.PG_HOST}:{self.PG_PORT}/{self.PG_DB}"


settings = Settings()
