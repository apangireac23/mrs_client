import axios from 'axios'
import { config } from '../config.js'
import { TMDB_IMAGE_BASE_URL } from '../constants.js'
import { supabase } from './supabase.js'

const CACHE_TTL_HOURS = 24

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  params: {
    api_key: config.tmdbApiKey,
  },
})

function formatMovie(movie) {
  return {
    movie_id: `tmdb_${movie.id}`,
    title: movie.title,
    poster_url: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
    overview: movie.overview,
    release_date: movie.release_date,
    genres: movie.genres?.map((g) => g.name).join(', ') || null,
    runtime: movie.runtime || null,
    vote_average: movie.vote_average || null,
    vote_count: movie.vote_count || null,
  }
}

function movieToCache(movie) {
  return {
    movie_id: movie.movie_id,
    title: movie.title,
    poster_url: movie.poster_url,
    overview: movie.overview,
    release_date: movie.release_date,
    genres: movie.genres,
    runtime: movie.runtime,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    updated_at: new Date().toISOString(),
  }
}

async function getCachedMovies(movieIds) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .in('movie_id', movieIds)
    .gt('updated_at', new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString())

  if (error || !data) return []
  return data
}

async function cacheMovies(movies) {
  if (movies.length === 0) return

  const moviesToInsert = movies.map(movieToCache)

  await supabase.from('movies').upsert(moviesToInsert, {
    onConflict: 'movie_id',
  })
}

export async function fetchPopularMovies() {
  const response = await tmdbClient.get('/movie/popular')
  const movies = (response.data.results || []).map(formatMovie)

  await cacheMovies(movies)

  return movies
}

export async function fetchMovieDetails(movieIds) {
  const normalizedIds = movieIds
    .map((movieId) => String(movieId || '').replace('tmdb_', ''))
    .filter(Boolean)

  const prefixedIds = normalizedIds.map((id) => `tmdb_${id}`)

  const cachedMovies = await getCachedMovies(prefixedIds)
  const cachedIds = new Set(cachedMovies.map((m) => m.movie_id))

  const movies = [...cachedMovies]

  const uncachedIds = prefixedIds.filter((id) => !cachedIds.has(id))

  if (uncachedIds.length > 0) {
    const freshMovies = []

    for (const movieId of uncachedIds) {
      try {
        const response = await tmdbClient.get(`/movie/${movieId.replace('tmdb_', '')}`)
        freshMovies.push(formatMovie(response.data))
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(`TMDB API error for movie ${movieId}:`, error.message)
          continue
        }
        throw error
      }
    }

    await cacheMovies(freshMovies)
    movies.push(...freshMovies)
  }

  return movies
}

export async function searchMovies(query) {
  const response = await tmdbClient.get('/search/movie', {
    params: {
      query,
    },
  })

  const movies = (response.data.results || []).map(formatMovie)
  await cacheMovies(movies)

  return movies
}

export async function syncPopularMovies() {
  const response = await tmdbClient.get('/movie/popular', {
    params: {
      page: 1,
    },
  })

  const movies = (response.data.results || []).map(formatMovie)
  await cacheMovies(movies)

  return movies
}
