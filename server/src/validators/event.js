import { z } from 'zod'
import { ALLOWED_EVENT_TYPES } from '../constants.js'

export const eventSchema = z.object({
  movie_id: z.string().startsWith('tmdb_', 'movie_id must use the tmdb_<id> format'),
  event_type: z.enum(ALLOWED_EVENT_TYPES, {
    error: `event_type must be one of: ${ALLOWED_EVENT_TYPES.join(', ')}`,
  }),
})

export function validateEvent(data) {
  return eventSchema.safeParse(data)
}
