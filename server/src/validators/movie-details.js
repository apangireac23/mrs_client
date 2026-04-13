import { z } from 'zod'

export const movieDetailsSchema = z.object({
  ids: z.array(z.string().startsWith('tmdb_', 'All IDs must use the tmdb_<id> format'))
    .min(1, 'At least one movie ID is required'),
})

export function validateMovieDetails(data) {
  // Ensure ids is an array before validation
  const ids = Array.isArray(data?.ids) ? data.ids : []
  return movieDetailsSchema.safeParse({ ids })
}
