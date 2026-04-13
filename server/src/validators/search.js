import { z } from 'zod'

export const searchSchema = z.object({
  q: z.string()
    .min(1, 'Search query cannot be empty')
    .transform((val) => val.trim()),
})

export function validateSearch(data) {
  // Handle case where q is missing or empty string from query param
  const query = data?.q ?? ''
  return searchSchema.safeParse({ q: String(query) })
}
