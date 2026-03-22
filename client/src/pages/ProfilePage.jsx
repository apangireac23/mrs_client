import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { apiRequest } from '../lib/api'

const sections = [
  { key: 'liked', title: 'Liked' },
  { key: 'watched', title: 'Watched' },
  { key: 'skipped', title: 'Skipped' },
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

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h2>Interaction history</h2>
          <p>Review the movies you have liked, watched, and skipped.</p>
        </div>
      </div>

      {loading ? <div className="page-message">Loading history...</div> : null}
      {error ? <div className="page-message error">{error}</div> : null}

      <div className="history-grid">
        {sections.map((section) => (
          <div key={section.key} className="history-panel">
            <h3>{section.title}</h3>

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
    </section>
  )
}
