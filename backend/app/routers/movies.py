from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.movie import MovieDetail, MovieSearchResponse
from app.services.tmdb import get_movie, search_movies

router = APIRouter(prefix="/movies", tags=["movies"])


@router.get("/search", response_model=MovieSearchResponse)
def search(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    current_user: User = Depends(get_current_user),
) -> MovieSearchResponse:
    data = search_movies(query=q, page=page)
    return MovieSearchResponse(**data)


@router.get("/{movie_id}", response_model=MovieDetail)
def movie_detail(
    movie_id: int,
    current_user: User = Depends(get_current_user),
) -> MovieDetail:
    data = get_movie(movie_id=movie_id)
    return MovieDetail(**data)