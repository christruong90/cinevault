from sqlalchemy.orm import Session

from app.models.movie import Movie
from app.services.tmdb import get_movie


def get_or_create_movie(db: Session, movie_id: int) -> Movie:
    movie = db.get(Movie, movie_id)
    if movie is not None:
        return movie

    movie_data = get_movie(movie_id=movie_id)
    movie = Movie(
        id=movie_data["id"],
        title=movie_data["title"],
        overview=movie_data.get("overview"),
        poster_path=movie_data.get("poster_path"),
        release_date=movie_data.get("release_date"),
        vote_average=movie_data.get("vote_average"),
    )
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie