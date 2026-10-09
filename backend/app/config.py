import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    apertus_base_url: str
    apertus_api_key: str
    apertus_model: str
    cors_origins: list[str]


def load_settings() -> Settings:
    origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173"
    )

    return Settings(
        apertus_base_url=os.getenv(
            "APERTUS_BASE_URL",
            ""
        ).rstrip("/"),

        apertus_api_key=os.getenv(
            "APERTUS_API_KEY",
            ""
        ),

        apertus_model=os.getenv(
            "APERTUS_MODEL",
            "swiss-ai/Apertus-v1.5-8B"
        ),

        cors_origins=[
            x.strip()
            for x in origins.split(",")
            if x.strip()
        ]
    )


settings = load_settings()