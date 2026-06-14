import { useNavigate } from 'react-router-dom'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w300'

function MovieCard({ movie }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
        aspectRatio: '2/3',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {movie.poster_path ? (
        <img
          src={`${POSTER_BASE}${movie.poster_path}`}
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}>
          No image
        </div>
      )}

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '2rem 0.75rem 0.75rem',
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
      }}>
        <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
          {movie.title}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {movie.release_date?.slice(0, 4)}
          </span>
          {movie.vote_average > 0 && (
            <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600' }}>
              ★ {movie.vote_average?.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
