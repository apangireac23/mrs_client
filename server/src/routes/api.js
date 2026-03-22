import express from 'express'
import { ALLOWED_EVENT_TYPES } from '../constants.js'
import { fetchRecommendations, forwardEvent } from '../lib/recommender.js'
import { supabase } from '../lib/supabase.js'
import { fetchMovieDetails, fetchPopularMovies, searchMovies } from '../lib/tmdb.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ ok: true })
})

router.get('/movies/popular', async (req, res, next) => {
  try {
    const movies = await fetchPopularMovies()
    res.json({ results: movies })
  } catch (error) {
    next(error)
  }
})

router.get('/movies/search', async (req, res, next) => {
  const query = String(req.query.q || '').trim()

  if (!query) {
    return res.status(400).json({ error: 'Query parameter q is required' })
  }

  try {
    const movies = await searchMovies(query)
    res.json({ results: movies })
  } catch (error) {
    next(error)
  }
})

router.get('/movies/details', async (req, res, next) => {
  const ids = String(req.query.ids || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (ids.length === 0) {
    return res.status(400).json({ error: 'Query parameter ids is required' })
  }

  if (ids.some((movieId) => !movieId.startsWith('tmdb_'))) {
    return res.status(400).json({ error: 'All ids must use the tmdb_<id> format' })
  }

  try {
    const movies = await fetchMovieDetails(ids)
    res.json({ results: movies })
  } catch (error) {
    next(error)
  }
})

router.post('/events', requireAuth, async (req, res, next) => {
  const { movie_id: movieId, event_type: eventType } = req.body || {}

  if (!movieId || typeof movieId !== 'string' || !movieId.startsWith('tmdb_')) {
    return res.status(400).json({ error: 'movie_id must use the tmdb_<id> format' })
  }

  if (!ALLOWED_EVENT_TYPES.includes(eventType)) {
    return res.status(400).json({ error: 'event_type must be one of like, watch, skip' })
  }

  const payload = {
    user_id: req.user.id,
    movie_id: movieId,
    event_type: eventType,
  }

  try {
    const { error } = await supabase.from('interactions').insert(payload)

    if (error) {
      throw error
    }

    const recommenderResponse = await forwardEvent(payload)

    res.status(201).json({
      success: true,
      recommender: recommenderResponse,
    })
  } catch (error) {
    next(error)
  }
})

router.post('/recommendations', requireAuth, async (req, res, next) => {
  const { k } = req.body || {}

  if (!Number.isInteger(k) || k <= 0) {
    return res.status(400).json({ error: 'k must be a positive integer' })
  }

  try {
    const { data, error } = await supabase
      .from('interactions')
      .select('movie_id, event_type, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    const interactions = (data || []).map((item) => ({
      movie_id: item.movie_id,
      event_type: item.event_type,
    }))

    const seedMovieIds = [
      ...new Set(
        (data || [])
          .filter((item) => item.event_type === 'like' || item.event_type === 'watch')
          .map((item) => item.movie_id),
      ),
    ]

    const recommenderPayload = {
      user_id: req.user.id,
      movie_id: data?.[0]?.movie_id || null,
      seed_movie_ids: seedMovieIds,
      interactions,
    }

    const recommendations = await fetchRecommendations(recommenderPayload)

    res.json({
      ...recommendations,
      recommendations: (recommendations.recommendations || []).slice(0, k),
    })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    next(error)
  }
})

router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('interactions')
      .select('movie_id, event_type, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    const history = {
      liked: [],
      watched: [],
      skipped: [],
    }

    for (const interaction of data || []) {
      if (interaction.event_type === 'like') {
        history.liked.push(interaction)
      }

      if (interaction.event_type === 'watch') {
        history.watched.push(interaction)
      }

      if (interaction.event_type === 'skip') {
        history.skipped.push(interaction)
      }
    }

    res.json(history)
  } catch (error) {
    next(error)
  }
})

export default router
