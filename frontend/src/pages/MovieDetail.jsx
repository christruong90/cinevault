import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovie } from '../api/movies'
import { getMovieReviews, createReview, deleteReview } from '../api/reviews'
import { addFavourite, removeFavourite } from '../api/favourites'
import { useAuth } from '../context/AuthContext'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w300'

function MovieDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [isFavourite, setIsFavourite] = useState(false)
  const [rating, setRating] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [movieData, reviewData] = await Promise.all([
          getMovie(id, token),
          getMovieReviews(id, token),
        ])
        setMovie(movieData)
        setReviews(reviewData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, token])

  async function handleFavourite() {
    try {
      if (isFavourite) {
        await removeFavourite(id, token)
        setIsFavourite(false)
      } else {
        await addFavourite(id, token)
        setIsFavourite(true)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault()
    try {
      const review = await createReview(id, Number(rating), body, token)
      setReviews(prev => {
        const existing = prev.findIndex(r => r.id === review.id)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = review
          return updated
        }
        return [review, ...prev]
      })
      setRating('')
      setBody('')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteReview(reviewId) {
    try {
      await deleteReview(reviewId, token)
      setReviews(prev => prev.filter(r => r.id !== reviewId))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!movie) return null

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back</button>

      {movie.poster_path && (
        <img src={`${POSTER_BASE}${movie.poster_path}`} alt={movie.title} />
      )}

      <h1>{movie.title}</h1>
      {movie.tagline && <p><em>{movie.tagline}</em></p>}
      <p>{movie.release_date?.slice(0, 4)} · {movie.runtime} min</p>
      <p>Rating: {movie.vote_average?.toFixed(1)} / 10</p>
      {movie.genres && <p>{movie.genres.map(g => g.name).join(', ')}</p>}
      <p>{movie.overview}</p>

      <button onClick={handleFavourite}>
        {isFavourite ? '★ Remove from Favourites' : '☆ Add to Favourites'}
      </button>

      <hr />
      <h2>Leave a Review</h2>
      <form onSubmit={handleReviewSubmit}>
        <div>
          <label>Rating (1–10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={e => setRating(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Review</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
          />
        </div>
        <button type="submit">Submit Review</button>
      </form>

      <hr />
      <h2>Reviews</h2>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map(review => (
        <div key={review.id}>
          <p>{review.rating} / 10</p>
          <p>{review.body}</p>
          <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default MovieDetail
