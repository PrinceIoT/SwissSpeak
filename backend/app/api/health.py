from fastapi import APIRouter

from app.config import settings


router = APIRouter(
    tags=["health"]
)


@router.get("/health")
def health():

    return {
        "status": "ok",
        "apertus_configured": bool(
            settings.apertus_api_key
            and settings.apertus_base_url
        ),
        "model": settings.apertus_model
    }