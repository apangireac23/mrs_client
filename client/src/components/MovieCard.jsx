import thumbsDownIcon from '../assets/thumbs-down.svg'

function LikeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="button-icon-svg" aria-hidden="true">
      <path
        d="M12 21 10.55 19.7C5.4 15.06 2 12 2 8.25 2 5.19 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6.02 6.02 0 0 1 16.5 3C19.58 3 22 5.19 22 8.25c0 3.75-3.4 6.81-8.55 11.46L12 21Z"
        fill="currentColor"
      />
    </svg>
  )
}

function WatchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="button-icon-svg" aria-hidden="true">
      <path
        d="M3 6.5A2.5 2.5 0 0 1 5.5 4h10A2.5 2.5 0 0 1 18 6.5v7A2.5 2.5 0 0 1 15.5 16h-10A2.5 2.5 0 0 1 3 13.5v-7Zm16 .6 2.75-1.85a.75.75 0 0 1 1.17.62v8.26a.75.75 0 0 1-1.17.62L19 12.9V7.1Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MovieCard({
  movie,
  pendingEvent,
  eventMessage,
  onInteract,
}) {
  return (
    <article className="movie-card">
      <div className="poster-frame">
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={movie.title} className="movie-poster" />
        ) : (
          <div className="poster-placeholder">No poster</div>
        )}
      </div>

      <div className="movie-body">
        <h3>{movie.title}</h3>
        <p className="movie-meta">{movie.release_date || 'Release date unavailable'}</p>

        <div className="movie-actions">
          <button
            className="icon-button"
            onClick={() => onInteract(movie.movie_id, 'like')}
            disabled={pendingEvent}
            title="Like"
            aria-label="Like"
          >
            <LikeIcon />
          </button>
          <button
            className="icon-button"
            onClick={() => onInteract(movie.movie_id, 'watch')}
            disabled={pendingEvent}
            title="Watch"
            aria-label="Watch"
          >
            <WatchIcon />
          </button>
          <button
            className="icon-button"
            onClick={() => onInteract(movie.movie_id, 'skip')}
            disabled={pendingEvent}
            title="Skip"
            aria-label="Skip"
          >
            <img src={thumbsDownIcon} alt="" className="button-icon-image" />
          </button>
        </div>

        <p className="event-feedback">{eventMessage || '\u00A0'}</p>
      </div>
    </article>
  )
}
