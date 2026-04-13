import * as Sentry from '@sentry/node'
import { config } from '../config.js'

export function initSentry() {
  if (!config.sentryDsn) {
    console.warn('Sentry DSN not configured. Errors will not be reported.')
    return
  }

  Sentry.init({
    dsn: config.sentryDsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
    sendDefaultPii: true,
  })

  console.log('Sentry initialized')
}

export function sentryRequestHandler(req, res, next) {
  if (!config.sentryDsn) {
    return next()
  }

  Sentry.setContext('request', {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
  })

  if (req.user) {
    Sentry.setUser({
      id: req.user.id,
      email: req.user.email,
    })
  }

  next()
}

export function sentryErrorHandler(err, req, res, next) {
  if (!config.sentryDsn) {
    return next(err)
  }

  Sentry.captureException(err)
  next(err)
}
