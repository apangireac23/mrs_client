import { z } from 'zod'

export const recommendationsSchema = z.object({
  k: z.number().int().positive('k must be a positive integer').optional().default(10),
})

export function validateRecommendations(data) {
  return recommendationsSchema.safeParse(data)
}
