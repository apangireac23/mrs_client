import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { apiRequest } from '../lib/api'

const sections = [
  { key: 'liked', title: 'Liked', icon: 'favorite', color: '#ff6e84' },
  { key: 'watched', title: 'Watched', icon: 'play_circle', color: '#a2a6ff' },
  { key: 'skipped', title: 'Skipped', icon: 'cancel', color: '#8a8a8d' },
]

export function ProfilePage() {
  const { session } = useAuth()
  const [history, setHistory] = useState({
    liked: [],
    watched: [],
    skipped: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadHistory() {
      setLoading(true)
      setError('')

      try {
        const data = await apiRequest('/api/history', {
          token: session.access_token,
        })

        const allMovieIds = [...data.liked || [], ...data.watched || [], ...data.skipped || []]
          .map((item) => item.movie_id)
          .filter(Boolean)
        const uniqueMovieIds = [...new Set(allMovieIds)]
        let movieTitles = {}

        if (uniqueMovieIds.length > 0) {
          const details = await apiRequest(
            `/api/movies/details?ids=${encodeURIComponent(uniqueMovieIds.join(','))}`,
          )

          movieTitles = Object.fromEntries(
            (details.results || []).map((movie) => [movie.movie_id, movie.title]),
          )
        }

        setHistory({
          liked: (data.liked || []).map((item) => ({
            ...item,
            title: movieTitles[item.movie_id] || item.movie_id,
          })),
          watched: (data.watched || []).map((item) => ({
            ...item,
            title: movieTitles[item.movie_id] || item.movie_id,
          })),
          skipped: (data.skipped || []).map((item) => ({
            ...item,
            title: movieTitles[item.movie_id] || item.movie_id,
          })),
        })
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [session.access_token])

  const totalInteractions = history.liked.length + history.watched.length + history.skipped.length

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h2>Interaction History</h2>
          <p>
            A curated chronicle of your cinematic journey. Review your past interactions,
            refined selections, and the films that didn't quite make the cut.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span>Loading history...</span>
        </div>
      ) : null}

      {error ? <div className="page-message error">{error}</div> : null}

      <div className="history-grid">
        {sections.map((section) => (
          <div key={section.key} className="history-panel">
            <div className={`history-panel-header ${section.key}`}>
              <span className="material-icons-round">{section.icon}</span>
              <h3>{section.title}</h3>
            </div>

            {history[section.key].length === 0 ? (
              <p className="empty-copy">No {section.key} movies yet.</p>
            ) : (
              history[section.key].map((item) => (
                <div key={`${section.key}-${item.movie_id}-${item.created_at}`} className="history-item">
                  <p className="list-title">{item.title}</p>
                  <p className="list-subtitle">{new Date(item.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {!loading && totalInteractions > 0 ? (
        <div className="history-insight">
          <h3>
            <span className="material-icons-round" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }}>insights</span>
            You've interacted with {totalInteractions} films
          </h3>
          <p>
            Based on your history, we've unlocked deeper personalization for your
            recommendations. Keep exploring to refine your taste profile further.
          </p>
        </div>
      ) : null}
    </section>
  )
}
