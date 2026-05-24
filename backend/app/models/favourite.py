from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Favourite(Base):
    __tablename__ = "favourites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="favourites")
    movie = relationship("Movie", back_populates="favourites")