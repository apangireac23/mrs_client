import rateLimit from 'express-rate-limit'

// General API limiter - 100 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Strict limiter for events - 30 events per minute
export const eventLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many events, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Recommendations limiter - 10 recommendations per minute
export const recommendationsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many recommendation requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Auth limiter - 5 auth attempts per minute
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})
