import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getWatchlist, removeFromWatchlist } from '../lib/api'

export function WatchlistPage() {
  const { session } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    loadWatchlist()
  }, [session.access_token])

  async function loadWatchlist() {
    setLoading(true)
    setError('')

    try {
      const data = await getWatchlist(session.access_token)
      setWatchlist(data.results || [])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(movie) {
    setRemovingId(movie.movie_id)
    try {
      await removeFromWatchlist(session.access_token, movie.movie_id)
      setWatchlist((prev) => prev.filter((item) => item.movie_id !== movie.movie_id))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h2>My Watchlist</h2>
          <p>
            A curated collection of your future cinematic experiences. From avant-garde
            indies to blockbuster epics, your journey through the lens is preserved here.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span>Loading watchlist...</span>
        </div>
      ) : null}

      {error ? <div className="page-message error">{error}</div> : null}

      {!loading && !error && watchlist.length === 0 ? (
        <div className="watchlist-empty">
          <span className="material-icons-round">bookmark_border</span>
          <h3>Your watchlist is empty</h3>
          <p>Start exploring the collection and save your favorites here.</p>
        </div>
      ) : null}

      <div className="watchlist-grid">
        {watchlist.map((movie) => (
          <div key={movie.movie_id} className="watchlist-item">
            <div className="watchlist-poster-frame">
              {movie.poster_url ? (
                <img src={movie.poster_url} alt={movie.title} className="watchlist-poster" />
              ) : (
                <div className="poster-placeholder">No poster</div>
              )}
            </div>
            <div className="watchlist-info">
              <h3>{movie.title}</h3>
              <p className="movie-meta">{movie.release_date || 'Date unavailable'}</p>
              <button
                className="remove-button"
                onClick={() => handleRemove(movie)}
                disabled={removingId === movie.movie_id}
              >
                <span className="material-icons-round" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>
                  {removingId === movie.movie_id ? 'hourglass_top' : 'delete_outline'}
                </span>
                {removingId === movie.movie_id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
