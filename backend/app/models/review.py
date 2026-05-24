from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-10
    body = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reviews")
    movie = relationship("Movie", back_populates="reviews")