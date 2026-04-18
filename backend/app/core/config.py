from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # Database
    DATABASE_URL: str

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # configuracao AI Gemini que estamos usando para mandar as respostas pro usuario
    GROQ_API_KEY: str

    class Config:
        env_file = ".env"


settings = Settings()