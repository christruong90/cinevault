from sqlalchemy import Column, Float, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True)  # TMDB movie ID
    title = Column(String(255), nullable=False)
    overview = Column(Text)
    poster_path = Column(String(255))
    release_date = Column(String(20))
    vote_average = Column(Float)

    reviews = relationship("Review", back_populates="movie")
    favourites = relationship("Favourite", back_populates="movie")