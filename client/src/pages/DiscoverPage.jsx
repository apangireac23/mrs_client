import { useCallback, useEffect, useState } from 'react'
import { MovieCard } from '../components/MovieCard'
import { useAuth } from '../hooks/useAuth'
import { apiRequest, addToWatchlist, removeFromWatchlist } from '../lib/api'

export function DiscoverPage() {
  const { session } = useAuth()
  const [movies, setMovies] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingMovieId, setPendingMovieId] = useState('')
  const [eventMessages, setEventMessages] = useState({})
  const [watchlist, setWatchlist] = useState(new Set())

  const loadWatchlist = useCallback(async () => {
    try {
      const data = await apiRequest('/api/watchlist', { token: session?.access_token })
      const watchlistSet = new Set((data.results || []).map((item) => item.movie_id))
      setWatchlist(watchlistSet)
    } catch (requestError) {
      // Silently fail - watchlist is optional
      console.error('Failed to load watchlist:', requestError)
    }
  }, [session?.access_token])

  useEffect(() => {
    loadPopularMovies()
    loadWatchlist()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadPopularMovies() {
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest('/api/movies/popular')
      setMovies(data.results || [])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }


  async function handleToggleWatchlist(movie) {
    const isInWatchlist = watchlist.has(movie.movie_id)

    try {
      if (isInWatchlist) {
        await removeFromWatchlist(session.access_token, movie.movie_id)
        setWatchlist((prev) => {
          const next = new Set(prev)
          next.delete(movie.movie_id)
          return next
        })
      } else {
        await addToWatchlist(session.access_token, movie)
        setWatchlist((prev) => {
          const next = new Set(prev)
          next.add(movie.movie_id)
          return next
        })
      }
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleSearch(event) {
    event.preventDefault()

    if (!query.trim()) {
      await loadPopularMovies()
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await apiRequest(`/api/movies/search?q=${encodeURIComponent(query.trim())}`)
      setMovies(data.results || [])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleInteract(movieId, eventType) {
    setPendingMovieId(movieId)
    setEventMessages((current) => ({
      ...current,
      [movieId]: '',
    }))

    try {
      await apiRequest('/api/events', {
        method: 'POST',
        token: session.access_token,
        body: {
          movie_id: movieId,
          event_type: eventType,
        },
      })

      setEventMessages((current) => ({
        ...current,
        [movieId]: `${eventType} saved`,
      }))
    } catch (requestError) {
      setEventMessages((current) => ({
        ...current,
        [movieId]: requestError.message,
      }))
    } finally {
      setPendingMovieId('')
    }
  }

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h2>Discover movies</h2>
          <p>
            Curated cinema for the refined viewer. Explore avant-garde masterpieces,
            contemporary legends, and hidden gems from the global film circuit.
          </p>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies..."
          />
          <button type="submit">
            <span className="material-icons-round" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '6px' }}>search</span>
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading-indicator">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span>Loading movies...</span>
        </div>
      ) : null}

      {error ? <div className="page-message error">{error}</div> : null}

      {!loading && !error && movies.length === 0 ? (
        <div className="reco-empty">
          <span className="material-icons-round reco-empty-icon">movie_filter</span>
          <h3>No movies found</h3>
          <p>Try a different search term or browse popular titles.</p>
        </div>
      ) : null}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.movie_id}
            movie={movie}
            pendingEvent={pendingMovieId === movie.movie_id}
            eventMessage={eventMessages[movie.movie_id]}
            onInteract={handleInteract}
            inWatchlist={watchlist.has(movie.movie_id)}
            onToggleWatchlist={handleToggleWatchlist}
          />
        ))}
      </div>
    </section>
  )
}
