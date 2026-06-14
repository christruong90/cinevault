import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/auth'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await registerUser(username, email, password)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.4rem',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>
          CineVault
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Create your account</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          </div>

          {error && (
            <p style={{ color: '#e05252', fontSize: '0.9rem' }}>{error}</p>
          )}

          <button
            type="submit"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#000',
              border: 'none',
              padding: '0.75rem',
              borderRadius: 'var(--radius)',
              fontWeight: '600',
              fontSize: '1rem',
              marginTop: '0.5rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent)'}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
