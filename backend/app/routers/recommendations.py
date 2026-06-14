from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.movie import MovieDetail
from app.services.recommendations import get_recommendations

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("", response_model=list[MovieDetail])
def recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[MovieDetail]:
    return get_recommendations(user_id=current_user.id, db=db)
