import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies" element={<div>Movies</div>} />
        <Route path="/movie/:id" element={<div>Movie Detail</div>} />
        <Route path="/favourites" element={<div>Favourites</div>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
