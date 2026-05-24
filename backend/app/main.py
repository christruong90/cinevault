from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
import app.models  # noqa: F401 — ensures all models are registered

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CineVault API",
    description="Backend API for CineVault — discover, review, and save films.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}