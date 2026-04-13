import { apiRequest } from './api'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Get the actual API base URL (from .env or test override)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

describe('apiRequest', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('makes GET request with correct headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    })

    await apiRequest('/api/test')

    expect(mockFetch).toHaveBeenCalledWith(`${apiBaseUrl}/api/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: undefined,
    })
  })

  it('includes authorization header when token provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    })

    await apiRequest('/api/test', { token: 'test-token' })

    expect(mockFetch).toHaveBeenCalledWith(`${apiBaseUrl}/api/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: undefined,
    })
  })

  it('makes POST request with body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    await apiRequest('/api/events', {
      method: 'POST',
      body: { movie_id: 'tmdb_1', event_type: 'like' },
    })

    expect(mockFetch).toHaveBeenCalledWith(`${apiBaseUrl}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movie_id: 'tmdb_1', event_type: 'like' }),
    })
  })

  it('throws error when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Not found' }),
    })

    await expect(apiRequest('/api/test')).rejects.toThrow('Not found')
  })

  it('throws generic error when no error message in response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    })

    await expect(apiRequest('/api/test')).rejects.toThrow('Request failed')
  })

  it('returns null when json parsing fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON')
      },
    })

    const result = await apiRequest('/api/test')
    expect(result).toBeNull()
  })
})
