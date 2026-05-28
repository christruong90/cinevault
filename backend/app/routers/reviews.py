from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewUpdate
from app.services.movie_cache import get_or_create_movie

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/me", response_model=list[ReviewResponse])
def my_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ReviewResponse]:
    reviews = (
        db.query(Review)
        .filter(Review.user_id == current_user.id)
        .order_by(Review.created_at.desc())
        .all()
    )
    return reviews


@router.get("/movies/{movie_id}", response_model=list[ReviewResponse])
def movie_reviews(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ReviewResponse]:
    _ = current_user
    reviews = (
        db.query(Review)
        .filter(Review.movie_id == movie_id)
        .order_by(Review.created_at.desc())
        .all()
    )
    return reviews


@router.post("/movies/{movie_id}", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    movie_id: int,
    payload: ReviewCreate,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReviewResponse:
    movie = get_or_create_movie(db=db, movie_id=movie_id)
    review = (
        db.query(Review)
        .filter(Review.user_id == current_user.id, Review.movie_id == movie.id)
        .first()
    )

    if review is None:
        review = Review(
            user_id=current_user.id,
            movie_id=movie.id,
            rating=payload.rating,
            body=payload.body,
        )
        db.add(review)
        response.status_code = status.HTTP_201_CREATED
    else:
        review.rating = payload.rating
        review.body = payload.body
        response.status_code = status.HTTP_200_OK

    db.commit()
    db.refresh(review)
    return review


@router.patch("/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    payload: ReviewUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReviewResponse:
    review = db.get(Review, review_id)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to edit this review")

    if payload.rating is not None:
        review.rating = payload.rating
    if payload.body is not None:
        review.body = payload.body

    db.commit()
    db.refresh(review)
    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    review = db.get(Review, review_id)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this review")

    db.delete(review)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)