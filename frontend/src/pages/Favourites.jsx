import { useEffect, useState } from 'react'
import { getMyFavourites, removeFavourite } from '../api/favourites'
import { useAuth } from '../context/AuthContext'
import MovieCard from '../components/MovieCard'
import Spinner from '../components/Spinner'

function Favourites() {
  const { token } = useAuth()
  const [favourites, setFavourites] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFavourites() {
      try {
        const data = await getMyFavourites(token)
        setFavourites(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchFavourites()
  }, [token])

  async function handleRemove(movieId) {
    try {
      await removeFavourite(movieId, token)
      setFavourites(prev => prev.filter(f => f.movie_id !== movieId))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Spinner />
  if (error) return <p style={{ color: '#e05252', padding: '2rem', textAlign: 'center' }}>{error}</p>

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>My Favourites</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {favourites.length} {favourites.length === 1 ? 'film' : 'films'} saved
      </p>

      {favourites.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem',
          color: 'var(--text-muted)',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No favourites yet</p>
          <p style={{ fontSize: '0.9rem' }}>Search for movies and save the ones you love</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1.25rem',
      }}>
        {favourites.map(fav => (
          <div key={fav.id} style={{ position: 'relative' }}>
            <MovieCard movie={{ ...fav.movie, id: fav.movie_id }} />
            <button
              onClick={() => handleRemove(fav.movie_id)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                backgroundColor: 'rgba(0,0,0,0.7)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(224,82,82,0.8)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              title="Remove from favourites"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favourites
