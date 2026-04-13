import express from 'express'
import { fetchRecommendations, forwardEvent } from '../lib/recommender.js'
import { supabase } from '../lib/supabase.js'
import { fetchMovieDetails, fetchPopularMovies, searchMovies, syncPopularMovies } from '../lib/tmdb.js'
import { requireAuth } from '../middleware/auth.js'
import { createValidator } from '../middleware/validate.js'
import { eventLimiter, recommendationsLimiter } from '../middleware/rate-limiter.js'
import { validateEvent } from '../validators/event.js'
import { validateRecommendations } from '../validators/recommendations.js'
import { validateSearch } from '../validators/search.js'
import { validateMovieDetails } from '../validators/movie-details.js'
import { validateWatchlist } from '../validators/watchlist.js'

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

router.post('/movies/sync', async (req, res, next) => {
  try {
    const movies = await syncPopularMovies()
    res.json({ success: true, count: movies.length, synced: movies })
  } catch (error) {
    next(error)
  }
})

router.get('/movies/search', createValidator(validateSearch, 'query'), async (req, res, next) => {
  try {
    const movies = await searchMovies(req.validated.q)
    res.json({ results: movies })
  } catch (error) {
    next(error)
  }
})

router.get('/movies/details', async (req, res, next) => {
  // Parse IDs from query string
  const ids = String(req.query.ids || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  // Check for empty IDs before validation
  if (ids.length === 0) {
    return res.status(400).json({ error: 'Query parameter ids is required' })
  }

  const validationResult = validateMovieDetails({ ids })
  if (!validationResult.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validationResult.error.issues.map((err) => ({
        field: 'ids',
        message: err.message,
      })),
    })
  }

  try {
    const movies = await fetchMovieDetails(validationResult.data.ids)
    res.json({ results: movies })
  } catch (error) {
    next(error)
  }
})

router.post('/events', eventLimiter, requireAuth, createValidator(validateEvent), async (req, res, next) => {
  const payload = {
    user_id: req.user.id,
    movie_id: req.validated.movie_id,
    event_type: req.validated.event_type,
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

router.post('/recommendations', recommendationsLimiter, requireAuth, async (req, res, next) => {
  // Validate k parameter manually since it needs to be an integer
  const { k } = req.body || {}
  if (k !== undefined && (!Number.isInteger(k) || k <= 0)) {
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

router.get('/watchlist', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    res.json({ results: data || [] })
  } catch (error) {
    next(error)
  }
})

router.post('/watchlist', requireAuth, createValidator(validateWatchlist), async (req, res, next) => {
  try {
    const payload = {
      user_id: req.user.id,
      movie_id: req.validated.movie_id,
      title: req.validated.title,
      poster_url: req.validated.poster_url || null,
      release_date: req.validated.release_date || null,
    }

    const { data, error } = await supabase
      .from('watchlist')
      .upsert(payload, { onConflict: 'user_id,movie_id' })
      .select()
      .single()

    if (error) {
      throw error
    }

    res.status(201).json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

router.delete('/watchlist/:movieId', requireAuth, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', req.user.id)
      .eq('movie_id', req.params.movieId)

    if (error) {
      throw error
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
