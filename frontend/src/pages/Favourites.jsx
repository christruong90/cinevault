import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyFavourites, removeFavourite } from '../api/favourites'
import { useAuth } from '../context/AuthContext'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w200'

function Favourites() {
  const { token } = useAuth()
  const navigate = useNavigate()
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

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>My Favourites</h1>
      {favourites.length === 0 && <p>No favourites yet.</p>}
      <div>
        {favourites.map(fav => (
          <div key={fav.id}>
            {fav.movie?.poster_path
              ? <img
                  src={`${POSTER_BASE}${fav.movie.poster_path}`}
                  alt={fav.movie?.title}
                  onClick={() => navigate(`/movie/${fav.movie_id}`)}
                  style={{ cursor: 'pointer' }}
                />
              : <div
                  onClick={() => navigate(`/movie/${fav.movie_id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  No image
                </div>
            }
            <p
              onClick={() => navigate(`/movie/${fav.movie_id}`)}
              style={{ cursor: 'pointer' }}
            >
              {fav.movie?.title}
            </p>
            <button onClick={() => handleRemove(fav.movie_id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favourites
