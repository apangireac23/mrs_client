import axios from 'axios'
import { config } from '../config.js'
import { TMDB_IMAGE_BASE_URL } from '../constants.js'

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
  }
}

export async function fetchPopularMovies() {
  const response = await tmdbClient.get('/movie/popular')
  return (response.data.results || []).map(formatMovie)
}

export async function fetchMovieDetails(movieIds) {
  const normalizedIds = movieIds
    .map((movieId) => String(movieId || '').replace('tmdb_', ''))
    .filter(Boolean)

  const movies = []

  for (const movieId of normalizedIds) {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}`)
      movies.push(formatMovie(response.data))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        continue
      }

      throw error
    }
  }

  return movies
}

export async function searchMovies(query) {
  const response = await tmdbClient.get('/search/movie', {
    params: {
      query,
    },
  })

  return (response.data.results || []).map(formatMovie)
}
