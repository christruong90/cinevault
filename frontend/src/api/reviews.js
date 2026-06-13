const BASE_URL = '/api'

export async function getMovieReviews(movieId, token) {
  const res = await fetch(`${BASE_URL}/reviews/movies/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to load reviews')
  }
  return res.json()
}

export async function createReview(movieId, rating, body, token) {
  const res = await fetch(`${BASE_URL}/reviews/movies/${movieId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rating, body }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to submit review')
  }
  return res.json()
}

export async function deleteReview(reviewId, token) {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to delete review')
  }
}
