import { z } from 'zod'

export const watchlistSchema = z.object({
  movie_id: z.string().startsWith('tmdb_', 'movie_id must use the tmdb_<id> format'),
  title: z.string().min(1, 'title is required'),
  poster_url: z.string().url().optional().nullable(),
  release_date: z.string().optional().nullable(),
})

export function validateWatchlist(data) {
  return watchlistSchema.safeParse(data)
}
