import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (!token) return null

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link to="/movies" style={{
        fontSize: '1.4rem',
        fontWeight: '700',
        color: 'var(--accent)',
        letterSpacing: '-0.5px',
      }}>
        CineVault
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/movies" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
          Search
        </Link>
        <Link to="/favourites" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
          Favourites
        </Link>
        <button onClick={handleLogout} style={{
          backgroundColor: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius)',
          fontSize: '0.9rem',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => {
            e.target.style.borderColor = 'var(--accent)'
            e.target.style.color = 'var(--accent)'
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = 'var(--border)'
            e.target.style.color = 'var(--text-muted)'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
