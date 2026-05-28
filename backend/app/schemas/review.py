from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.movie import MovieResult


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=10)
    body: str | None = Field(default=None, max_length=5000)


class ReviewUpdate(BaseModel):
    rating: int | None = Field(default=None, ge=1, le=10)
    body: str | None = Field(default=None, max_length=5000)


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    movie_id: int
    rating: int
    body: str | None = None
    created_at: datetime | None = None
    movie: MovieResult | None = None

    model_config = {"from_attributes": True}