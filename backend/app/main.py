from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.routers import auth, favourites, movies, reviews
import app.models  # noqa: F401 — ensures all models are registered

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CineVault API",
    description="Backend API for CineVault — discover, review, and save films.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(reviews.router)
app.include_router(favourites.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}