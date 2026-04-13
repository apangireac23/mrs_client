-- Watchlist table for saving movies to watch later
-- Created: 2026-04-10

CREATE TABLE IF NOT EXISTS watchlist (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id TEXT NOT NULL,
  title TEXT NOT NULL,
  poster_url TEXT,
  release_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);

-- RLS Policies
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Users can only view their own watchlist
CREATE POLICY "Users can view own watchlist"
  ON watchlist
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert into their own watchlist
CREATE POLICY "Users can insert into own watchlist"
  ON watchlist
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete from their own watchlist
CREATE POLICY "Users can delete from own watchlist"
  ON watchlist
  FOR DELETE
  USING (auth.uid() = user_id);
