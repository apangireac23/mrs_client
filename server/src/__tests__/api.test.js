import request from 'supertest'
import app from '../app.js'

describe('Health Check', () => {
  it('GET /health returns ok status', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('ok')
    expect(response.body).toHaveProperty('missing_env')
  })

  it('GET /api/health returns ok status', async () => {
    const response = await request(app).get('/api/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ ok: true })
  })
})

describe('Movies API', () => {
  describe('GET /api/movies/popular', () => {
    it('returns valid response structure', async () => {
      const response = await request(app).get('/api/movies/popular')
      // Handle both success and TMDB API errors
      expect([200, 502, 503]).toContain(response.status)
      if (response.status === 200) {
        expect(response.body).toHaveProperty('results')
        expect(Array.isArray(response.body.results)).toBe(true)
      }
    })

    it('movie objects have required fields when available', async () => {
      const response = await request(app).get('/api/movies/popular')
      if (response.status === 200 && response.body.results.length > 0) {
        const movie = response.body.results[0]
        expect(movie).toHaveProperty('movie_id')
        expect(movie).toHaveProperty('title')
        expect(movie).toHaveProperty('poster_url')
        expect(movie).toHaveProperty('release_date')
      }
    })
  })

  describe('POST /api/movies/sync', () => {
    it('syncs popular movies to cache', async () => {
      const response = await request(app).post('/api/movies/sync')
      // May succeed or fail depending on TMDB API availability
      expect([200, 502, 503]).toContain(response.status)
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('count')
      }
    })
  })

  describe('GET /api/movies/search', () => {
    it('returns 400 without query parameter', async () => {
      const response = await request(app).get('/api/movies/search')
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
    })

    it('returns search results for valid query', async () => {
      const response = await request(app).get('/api/movies/search?q=batman')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('results')
      expect(Array.isArray(response.body.results)).toBe(true)
    })

    it('returns empty results for empty query', async () => {
      const response = await request(app).get('/api/movies/search?q=')
      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/movies/details', () => {
    it('returns 400 without ids parameter', async () => {
      const response = await request(app).get('/api/movies/details')
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
    })

    it('returns 400 for invalid movie id format', async () => {
      const response = await request(app).get('/api/movies/details?ids=123')
      expect(response.status).toBe(400)
      expect(response.body.details).toBeDefined()
      expect(response.body.details[0].message).toContain('tmdb_')
    })

    it('returns movie details for valid tmdb id', async () => {
      const response = await request(app).get('/api/movies/details?ids=tmdb_155')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('results')
    })
  })
})

describe('Protected Routes', () => {
  // Note: These tests verify auth middleware is applied
  // Full integration tests require valid Supabase tokens

  describe('POST /api/events', () => {
    it('returns 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/events')
        .send({ movie_id: 'tmdb_155', event_type: 'like' })
      expect(response.status).toBe(401)
    })

    it('returns 401 with invalid token (auth middleware working)', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', 'Bearer invalid-token')
        .send({ movie_id: 'tmdb_155', event_type: 'like' })
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/recommendations', () => {
    it('returns 401 without auth token', async () => {
      const response = await request(app).post('/api/recommendations')
      expect(response.status).toBe(401)
    })

    it('returns 401 with invalid token (auth middleware working)', async () => {
      const response = await request(app)
        .post('/api/recommendations')
        .set('Authorization', 'Bearer invalid-token')
        .send({ k: 10 })
      expect(response.status).toBe(401)
    })
  })

  describe('GET /api/history', () => {
    it('returns 401 without auth token', async () => {
      const response = await request(app).get('/api/history')
      expect(response.status).toBe(401)
    })

    it('returns 401 with invalid token (auth middleware working)', async () => {
      const response = await request(app)
        .get('/api/history')
        .set('Authorization', 'Bearer invalid-token')
      expect(response.status).toBe(401)
    })
  })
})
