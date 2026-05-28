from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from app.schemas.movie import MovieResult


class FavouriteResponse(BaseModel):
    id: int
    user_id: int
    movie_id: int
    created_at: datetime | None = None
    movie: MovieResult | None = None

    model_config = {"from_attributes": True}