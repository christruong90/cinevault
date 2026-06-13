import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/register" element={<div>Register</div>} />
      <Route path="/movies" element={<div>Movies</div>} />
      <Route path="/movie/:id" element={<div>Movie Detail</div>} />
      <Route path="/favourites" element={<div>Favourites</div>} />
    </Routes>
  )
}

export default App
