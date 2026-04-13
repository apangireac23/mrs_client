import dotenv from 'dotenv'

dotenv.config({ override: true })

const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'TMDB_API_KEY',
  'RECOMMENDER_API_URL',
]

export const config = {
  port: Number(process.env.PORT || 4000),
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
  tmdbApiKey: process.env.TMDB_API_KEY || '',
  recommenderApiUrl: process.env.RECOMMENDER_API_URL || '',
  sentryDsn: process.env.SENTRY_DSN || '',
}

export function getMissingEnvVars() {
  return requiredEnvVars.filter((key) => !process.env[key])
}
