import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchMovies } from '../api/movies'
import { useAuth } from '../context/AuthContext'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w200'

function Movies() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const navigate = useNavigate()

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await searchMovies(query, 1, token)
      setResults(data.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Search Movies</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div>
        {results.map(movie => (
          <div key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)} style={{ cursor: 'pointer' }}>
            {movie.poster_path
              ? <img src={`${POSTER_BASE}${movie.poster_path}`} alt={movie.title} />
              : <div>No image</div>
            }
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.slice(0, 4)}</p>
            <p>{movie.vote_average?.toFixed(1)} / 10</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Movies
