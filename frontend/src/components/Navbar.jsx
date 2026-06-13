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
    <nav>
      <Link to="/movies">Search</Link>
      {' | '}
      <Link to="/favourites">Favourites</Link>
      {' | '}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}

export default Navbar
