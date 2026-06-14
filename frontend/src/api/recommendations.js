const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function getRecommendations(token) {
  const res = await fetch(`${BASE_URL}/recommendations`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to load recommendations')
  }
  return res.json()
}
