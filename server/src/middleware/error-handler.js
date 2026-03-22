import axios from 'axios'

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 502
    const details = error.response?.data || null

    return res.status(status).json({
      error: 'Upstream request failed',
      details,
    })
  }

  if (error?.code === 'PGRST116') {
    return res.status(404).json({ error: 'Resource not found' })
  }

  console.error(error)

  return res.status(500).json({
    error: error?.message || 'Internal server error',
  })
}
