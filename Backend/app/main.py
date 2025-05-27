from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import video_processing
from app.models.database import Base, engine
import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(video_processing.router, prefix="/api/v1")