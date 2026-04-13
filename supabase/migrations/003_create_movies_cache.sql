-- Movies metadata cache table
-- Reduces TMDB API calls by caching movie details locally
-- Created: 2026-04-10

CREATE TABLE IF NOT EXISTS movies (
  movie_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  poster_url TEXT,
  overview TEXT,
  release_date TEXT,
  genres TEXT,
  runtime INTEGER,
  vote_average DECIMAL(3,2),
  vote_count INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  
);

-- Index for searching by title
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);

-- Index for filtering by release date
CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies(release_date);
