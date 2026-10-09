from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.api.health import (
    router as health_router
)

from app.api.lessons import (
    router as lessons_router
)

from app.api.tutor import (
    router as tutor_router
)


app = FastAPI(
    title="SwissSpeak API",
    version="0.1.0"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=settings.cors_origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


app.include_router(
    health_router,
    prefix="/api"
)

app.include_router(
    lessons_router,
    prefix="/api"
)

app.include_router(
    tutor_router,
    prefix="/api"
)


@app.get("/")
def root():

    return {
        "name": "SwissSpeak API",
        "version": "0.1.0"
    }