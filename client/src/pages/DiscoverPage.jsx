import { useEffect, useState } from 'react'
import { MovieCard } from '../components/MovieCard'
import { useAuth } from '../hooks/useAuth'
import { apiRequest } from '../lib/api'

export function DiscoverPage() {
  const { session } = useAuth()
  const [movies, setMovies] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingMovieId, setPendingMovieId] = useState('')
  const [eventMessages, setEventMessages] = useState({})

  useEffect(() => {
    loadPopularMovies()
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
          <p>Browse popular titles or search TMDB through the backend.</p>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies"
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading ? <div className="page-message">Loading movies...</div> : null}
      {error ? <div className="page-message error">{error}</div> : null}
      {!loading && !error && movies.length === 0 ? (
        <div className="page-message">No movies found.</div>
      ) : null}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.movie_id}
            movie={movie}
            pendingEvent={pendingMovieId === movie.movie_id}
            eventMessage={eventMessages[movie.movie_id]}
            onInteract={handleInteract}
          />
        ))}
      </div>
    </section>
  )
}
