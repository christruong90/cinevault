import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovie } from '../api/movies'
import { useAuth } from '../context/AuthContext'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w300'

function MovieDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMovie() {
      try {
        const data = await getMovie(id, token)
        setMovie(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [id, token])

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
      {movie.genres && (
        <p>{movie.genres.map(g => g.name).join(', ')}</p>
      )}
      <p>{movie.overview}</p>
    </div>
  )
}

export default MovieDetail
