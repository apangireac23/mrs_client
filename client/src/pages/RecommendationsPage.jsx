import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { apiRequest } from '../lib/api'

export function RecommendationsPage() {
  const { session } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFetchRecommendations() {
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest('/api/recommendations', {
        method: 'POST',
        token: session.access_token,
        body: { k: 20 },
      })

      const recommendationIds = (data.recommendations || []).filter(
        (item) => typeof item === 'string' && item.startsWith('tmdb_'),
      )

      if (recommendationIds.length === 0) {
        setRecommendations([])
        return
      }

      const details = await apiRequest(
        `/api/movies/details?ids=${encodeURIComponent(recommendationIds.join(','))}`,
      )

      setRecommendations(details.results || [])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h2>Recommendations</h2>
          <p>Fetch personalized recommendations through the Express BFF.</p>
        </div>

        <button onClick={handleFetchRecommendations} disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </div>

      {error ? <div className="page-message error">{error}</div> : null}
      {!loading && recommendations.length === 0 ? (
        <div className="page-message">No recommendations loaded yet.</div>
      ) : null}

      <div className="movie-grid">
        {recommendations.map((recommendation) => (
          <article key={recommendation.movie_id} className="movie-card">
            <div className="poster-frame">
              {recommendation.poster_url ? (
                <img
                  src={recommendation.poster_url}
                  alt={recommendation.title}
                  className="movie-poster"
                />
              ) : (
                <div className="poster-placeholder">No poster</div>
              )}
            </div>

            <div className="movie-body">
              <h3>{recommendation.title}</h3>
              <p className="movie-meta">{recommendation.release_date || 'Release date unavailable'}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
