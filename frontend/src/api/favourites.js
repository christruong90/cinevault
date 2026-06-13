const BASE_URL = '/api'

export async function getMyFavourites(token) {
  const res = await fetch(`${BASE_URL}/favourites/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to load favourites')
  }
  return res.json()
}

export async function addFavourite(movieId, token) {
  const res = await fetch(`${BASE_URL}/favourites/movies/${movieId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to add favourite')
  }
  return res.json()
}

export async function removeFavourite(movieId, token) {
  const res = await fetch(`${BASE_URL}/favourites/movies/${movieId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to remove favourite')
  }
}
