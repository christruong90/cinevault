import httpx
from fastapi import HTTPException

from app.core.config import settings

TMDB_BASE_URL = "https://api.themoviedb.org/3"


def _headers() -> dict:
    return {"Authorization": f"Bearer {settings.TMDB_API_KEY}"}


def search_movies(query: str, page: int = 1) -> dict:
    url = f"{TMDB_BASE_URL}/search/movie"
    params = {"query": query, "page": page, "include_adult": False}
    response = httpx.get(url, headers=_headers(), params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="TMDB search failed")
    return response.json()


def get_movie(movie_id: int) -> dict:
    url = f"{TMDB_BASE_URL}/movie/{movie_id}"
    response = httpx.get(url, headers=_headers())
    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="Movie not found")
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="TMDB request failed")
    return response.json()