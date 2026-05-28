from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.favourite import Favourite
from app.models.user import User
from app.schemas.favourite import FavouriteResponse
from app.services.movie_cache import get_or_create_movie

router = APIRouter(prefix="/favourites", tags=["favourites"])


@router.get("/me", response_model=list[FavouriteResponse])
def my_favourites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[FavouriteResponse]:
    favourites = (
        db.query(Favourite)
        .filter(Favourite.user_id == current_user.id)
        .order_by(Favourite.created_at.desc())
        .all()
    )
    return favourites


@router.post("/movies/{movie_id}", response_model=FavouriteResponse, status_code=status.HTTP_201_CREATED)
def add_favourite(
    movie_id: int,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FavouriteResponse:
    movie = get_or_create_movie(db=db, movie_id=movie_id)
    favourite = (
        db.query(Favourite)
        .filter(Favourite.user_id == current_user.id, Favourite.movie_id == movie.id)
        .first()
    )

    if favourite is None:
        favourite = Favourite(user_id=current_user.id, movie_id=movie.id)
        db.add(favourite)
        response.status_code = status.HTTP_201_CREATED
    else:
        response.status_code = status.HTTP_200_OK

    db.commit()
    db.refresh(favourite)
    return favourite


@router.delete("/movies/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favourite(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    favourite = (
        db.query(Favourite)
        .filter(Favourite.user_id == current_user.id, Favourite.movie_id == movie_id)
        .first()
    )
    if favourite is not None:
        db.delete(favourite)
        db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)