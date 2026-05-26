from __future__ import annotations

from pydantic import BaseModel


class MovieResult(BaseModel):
    id: int
    title: str
    overview: str | None = None
    poster_path: str | None = None
    release_date: str | None = None
    vote_average: float | None = None


class MovieSearchResponse(BaseModel):
    page: int
    total_pages: int
    total_results: int
    results: list[MovieResult]


class MovieDetail(BaseModel):
    id: int
    title: str
    overview: str | None = None
    poster_path: str | None = None
    release_date: str | None = None
    vote_average: float | None = None
    runtime: int | None = None
    genres: list[dict] | None = None
    tagline: str | None = None