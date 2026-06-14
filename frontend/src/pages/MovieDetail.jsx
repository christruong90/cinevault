import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovie } from '../api/movies'
import { getMovieReviews, createReview, deleteReview } from '../api/reviews'
import { addFavourite, removeFavourite } from '../api/favourites'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w300'

function StarRating({ value }) {
  const stars = Math.round((value / 10) * 5)
  return (
    <span style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
        {value?.toFixed(1)} / 10
      </span>
    </span>
  )
}

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

  if (loading) return <Spinner />
  if (error) return <p style={{ color: '#e05252', padding: '2rem', textAlign: 'center' }}>{error}</p>
  if (!movie) return null

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius)',
          marginBottom: '2rem',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
        onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)' }}
      >
        ← Back
      </button>

      <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {movie.poster_path && (
          <img
            src={`${POSTER_BASE}${movie.poster_path}`}
            alt={movie.title}
            style={{ borderRadius: 'var(--radius)', width: '300px', flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{movie.title}</h1>
          {movie.tagline && (
            <p style={{ color: 'var(--accent)', fontStyle: 'italic', marginBottom: '1rem' }}>{movie.tagline}</p>
          )}
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {movie.release_date?.slice(0, 4)} · {movie.runtime} min
          </p>
          {movie.vote_average > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <StarRating value={movie.vote_average} />
            </div>
          )}
          {movie.genres && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {movie.genres.map(g => (
                <span key={g.id} style={{
                  padding: '0.3rem 0.8rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}>
                  {g.name}
                </span>
              ))}
            </div>
          )}
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>{movie.overview}</p>
          <button
            onClick={handleFavourite}
            style={{
              backgroundColor: isFavourite ? 'var(--accent)' : 'transparent',
              color: isFavourite ? '#000' : 'var(--accent)',
              border: '1px solid var(--accent)',
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--radius)',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
          >
            {isFavourite ? '★ Saved' : '☆ Add to Favourites'}
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1.5rem' }}>Leave a Review</h2>
        <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Rating (1–10)
            </label>
            <input
              type="number" min="1" max="10"
              value={rating}
              onChange={e => setRating(e.target.value)}
              required
              style={{
                width: '100px',
                padding: '0.6rem 1rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Review
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#000',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius)',
              fontWeight: '600',
              width: 'fit-content',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent)'}
          >
            Submit Review
          </button>
        </form>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1.5rem' }}>Reviews</h2>
        {reviews.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(review => (
            <div key={review.id} style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--accent)', fontWeight: '600' }}>★ {review.rating} / 10</span>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#e05252'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                  Delete
                </button>
              </div>
              {review.body && <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{review.body}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieDetail
