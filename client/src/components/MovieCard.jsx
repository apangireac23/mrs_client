import { useState } from 'react'

export function MovieCard({
  movie,
  pendingEvent,
  eventMessage,
  onInteract,
  inWatchlist = false,
  onToggleWatchlist,
}) {
  const [isHovered, setIsHovered] = useState(false)

  const year = movie.release_date ? movie.release_date.split('-')[0] : null

  return (
    <article
      className={`mc-card ${isHovered ? 'mc-card--hover' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* === Poster Image === */}
      <div className="mc-poster-frame">
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={movie.title} className="mc-poster-img" />
        ) : (
          <div className="mc-poster-placeholder">
            <span className="material-icons-round">movie</span>
          </div>
        )}

        {/* Bottom gradient - always visible */}
        <div className="mc-poster-gradient" />

        {/* Hover overlay */}
        <div className="mc-hover-overlay" />
      </div>

      {/* === Floating Top-Right Icons (Default State) === */}
      <div className="mc-top-actions">
        <button
          className="mc-float-btn"
          onClick={(e) => { e.stopPropagation(); onInteract(movie.movie_id, 'like') }}
          disabled={pendingEvent}
          title="Like"
          aria-label="Like"
        >
          <span className="material-icons-round">favorite</span>
        </button>
        <button
          className={`mc-float-btn ${inWatchlist ? 'mc-float-btn--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleWatchlist?.(movie) }}
          disabled={pendingEvent}
          title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          aria-label="Watchlist"
        >
          <span className="material-icons-round">{inWatchlist ? 'bookmark' : 'bookmark_border'}</span>
        </button>
      </div>

      {/* === Watchlist Badge (when saved) === */}
      {inWatchlist && (
        <div className="mc-saved-badge">
          <span className="material-icons-round">bookmark</span>
          Added to Watchlist
        </div>
      )}

      {/* === Bottom Info - Default State === */}
      <div className="mc-default-info">
        {/* Genre / Year chips */}
        <div className="mc-chips">
          {year && <span className="mc-chip">{year}</span>}
        </div>

        <h3 className="mc-title">{movie.title}</h3>
        <p className="mc-meta">
          {movie.release_date || 'Release date unavailable'}
        </p>
      </div>

      {/* === Hover Content === */}
      <div className="mc-hover-content">
        <h3 className="mc-hover-title">{movie.title}</h3>
        <p className="mc-hover-meta">
          {year && `${year} • `}
          {movie.overview
            ? movie.overview.slice(0, 120) + (movie.overview.length > 120 ? '...' : '')
            : 'A captivating cinematic experience awaits.'}
        </p>

        {/* Center Play Button */}
        <button
          className="mc-play-btn"
          onClick={(e) => { e.stopPropagation(); onInteract(movie.movie_id, 'watch') }}
          disabled={pendingEvent}
          title="Watch"
          aria-label="Watch"
        >
          <span className="material-icons-round">play_arrow</span>
        </button>

        {/* Watch Now CTA */}
        <button
          className="mc-watch-btn"
          onClick={(e) => { e.stopPropagation(); onInteract(movie.movie_id, 'watch') }}
          disabled={pendingEvent}
        >
          <span className="material-icons-round" style={{ fontSize: '16px' }}>play_circle</span>
          WATCH NOW
        </button>

        {/* Bottom Action Row */}
        <div className="mc-hover-actions">
          <button
            className="mc-action-chip"
            onClick={(e) => { e.stopPropagation(); onInteract(movie.movie_id, 'like') }}
            disabled={pendingEvent}
            title="Like"
          >
            <span className="material-icons-round">favorite</span>
          </button>

          <button
            className="mc-action-chip"
            onClick={(e) => { e.stopPropagation(); onInteract(movie.movie_id, 'skip') }}
            disabled={pendingEvent}
            title="Skip"
          >
            <span className="material-icons-round">close</span>
            Skip
          </button>

          <button
            className={`mc-action-chip ${inWatchlist ? 'mc-action-chip--active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleWatchlist?.(movie) }}
            disabled={pendingEvent}
            title={inWatchlist ? 'Saved' : 'Save'}
          >
            <span className="material-icons-round">{inWatchlist ? 'bookmark' : 'bookmark_border'}</span>
            {inWatchlist ? 'Saved' : 'Save'}
          </button>

          {movie.vote_average ? (
            <span className="mc-rating">
              <span className="material-icons-round" style={{ fontSize: '14px', color: '#f5c518' }}>star</span>
              {Number(movie.vote_average).toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>

      {/* === Event Feedback === */}
      {eventMessage && (
        <div className="mc-feedback">
          <span className="material-icons-round" style={{ fontSize: '14px' }}>check_circle</span>
          {eventMessage}
        </div>
      )}
    </article>
  )
}
