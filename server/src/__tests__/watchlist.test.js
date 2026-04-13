import request from 'supertest'
import app from '../app.js'

const mockMovie = {
  movie_id: 'tmdb_155',
  title: 'The Dark Knight',
  poster_url: 'https://image.tmdb.org/poster.jpg',
  release_date: '2008-07-18',
}

describe('Watchlist API', () => {
  describe('GET /api/watchlist', () => {
    it('returns 401 without auth', async () => {
      const response = await request(app).get('/api/watchlist')
      expect(response.status).toBe(401)
    })

    it('returns 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/watchlist')
        .set('Authorization', 'Bearer invalid-token')
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/watchlist', () => {
    it('returns 401 without auth', async () => {
      const response = await request(app).post('/api/watchlist').send(mockMovie)
      expect(response.status).toBe(401)
    })

    it('returns 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/watchlist')
        .set('Authorization', 'Bearer invalid-token')
        .send(mockMovie)
      expect(response.status).toBe(401)
    })
  })

  describe('DELETE /api/watchlist/:movieId', () => {
    it('returns 401 without auth', async () => {
      const response = await request(app).delete('/api/watchlist/tmdb_155')
      expect(response.status).toBe(401)
    })

    it('returns 401 with invalid token', async () => {
      const response = await request(app)
        .delete('/api/watchlist/tmdb_155')
        .set('Authorization', 'Bearer invalid-token')
      expect(response.status).toBe(401)
    })
  })
})
