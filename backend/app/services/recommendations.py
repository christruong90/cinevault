import json
import anthropic
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.favourite import Favourite
from app.services.tmdb import get_movie


def get_recommendations(user_id: int, db: Session) -> list[dict]:
    favourites = (
        db.query(Favourite)
        .filter(Favourite.user_id == user_id)
        .limit(10)
        .all()
    )

    if not favourites:
        return []

    genres: set[str] = set()
    favourite_ids: list[int] = []

    for fav in favourites:
        favourite_ids.append(fav.movie_id)
        try:
            movie_data = get_movie(fav.movie_id)
            for g in (movie_data.get("genres") or []):
                genres.add(g["name"])
        except Exception:
            continue

    if not genres:
        return []

    genre_list = ", ".join(sorted(genres))

    try:
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=512,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"A user enjoys movies in these genres: {genre_list}. "
                        f"They have already seen movies with these TMDB IDs: {favourite_ids}. "
                        "Recommend exactly 5 other movies they would enjoy. "
                        "Reply with ONLY a JSON array of TMDB movie IDs as integers, no explanation. "
                        "Example: [550, 680, 13, 238, 424]"
                    ),
                }
            ],
        )
        text = message.content[0].text.strip()
        recommended_ids = json.loads(text)
    except Exception:
        # fallback to popular movies for testing without API credits
        recommended_ids = [550, 680, 13, 238, 424]

    results = []
    for movie_id in recommended_ids[:5]:
        try:
            movie = get_movie(movie_id)
            results.append(movie)
        except Exception:
            continue

    return results
