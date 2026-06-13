const BASE_URL = '/api'

export async function searchMovies(query, page = 1, token) {
  const res = await fetch(
    `${BASE_URL}/movies/search?q=${encodeURIComponent(query)}&page=${page}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Search failed')
  }
  return res.json()
}

export async function getMovie(movieId, token) {
  const res = await fetch(`${BASE_URL}/movies/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to load movie')
  }
  return res.json()
}
