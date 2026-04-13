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
      {/* Hero Banner */}
      <div className="reco-hero">
        <div className="reco-hero-text">
          <h2>Your Premiere Selection</h2>
          <p>
            Our algorithm has analyzed your viewing history to curate a premiere-quality
            selection of cinema that matches your unique artistic palate.
          </p>
          <span className="reco-genre-chip">
            <span className="material-icons-round" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>auto_awesome</span>
            AI-Powered
          </span>
        </div>
        <button onClick={handleFetchRecommendations} disabled={loading}>
          <span className="material-icons-round" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '8px' }}>
            {loading ? 'hourglass_top' : 'movie_filter'}
          </span>
          {loading ? 'Generating...' : 'Get Recommendations'}
        </button>
      </div>

      {error ? <div className="page-message error">{error}</div> : null}

      {!loading && recommendations.length === 0 ? (
        <div className="reco-empty">
          <span className="material-icons-round reco-empty-icon">theaters</span>
          <h3>No recommendations loaded yet</h3>
          <p>
            Refine your taste profile by rating more films or use the generator
            above to refresh your feed.
          </p>
        </div>
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
