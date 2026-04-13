const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed')
  }

  return data
}

export async function getWatchlist(token) {
  return apiRequest('/api/watchlist', { token })
}

export async function addToWatchlist(token, movie) {
  return apiRequest('/api/watchlist', {
    method: 'POST',
    token,
    body: {
      movie_id: movie.movie_id,
      title: movie.title,
      poster_url: movie.poster_url,
      release_date: movie.release_date,
    },
  })
}

export async function removeFromWatchlist(token, movieId) {
  return apiRequest(`/api/watchlist/${movieId}`, {
    method: 'DELETE',
    token,
  })
}
