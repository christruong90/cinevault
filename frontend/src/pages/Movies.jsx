import { useState, useEffect } from 'react'
import { searchMovies } from '../api/movies'
import { getRecommendations } from '../api/recommendations'
import { useAuth } from '../context/AuthContext'
import MovieCard from '../components/MovieCard'
import Spinner from '../components/Spinner'

function Movies() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recsLoading, setRecsLoading] = useState(true)
  const [searched, setSearched] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const data = await getRecommendations(token)
        setRecommendations(data)
      } catch (err) {
        // silently fail — recommendations are optional
      } finally {
        setRecsLoading(false)
      }
    }
    fetchRecommendations()
  }, [token])

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setSearched(true)
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Recommendations section */}
      {recsLoading && <Spinner />}
      {!recsLoading && recommendations.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.4rem' }}>
            Recommended for You
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Based on your favourites
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '1.25rem',
          }}>
            {recommendations.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* Search section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Discover Movies
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Search millions of films
        </p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.85rem 1.25rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#000',
              border: 'none',
              padding: '0.85rem 1.75rem',
              borderRadius: 'var(--radius)',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent)'}
          >
            Search
          </button>
        </form>
      </div>

      {loading && <Spinner />}
      {error && <p style={{ color: '#e05252', textAlign: 'center' }}>{error}</p>}

      {!loading && searched && results.length === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No results found.</p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1.25rem',
      }}>
        {results.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default Movies
