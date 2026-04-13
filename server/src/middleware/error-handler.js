import * as Sentry from '@sentry/node'
import axios from 'axios'
import { config } from '../config.js'

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 502
    const details = error.response?.data || null

    if (config.sentryDsn) {
      Sentry.setContext('axios_error', {
        url: error.config?.url,
        method: error.config?.method,
        status,
      })
      Sentry.captureException(error)
    }

    return res.status(status).json({
      error: 'Upstream request failed',
      details,
    })
  }

  if (error?.code === 'PGRST116') {
    return res.status(404).json({ error: 'Resource not found' })
  }

  console.error(error)

  if (config.sentryDsn) {
    Sentry.captureException(error)
  }

  return res.status(500).json({
    error: error?.message || 'Internal server error',
  })
}
