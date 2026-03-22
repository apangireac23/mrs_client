import { supabase } from '../lib/supabase.js'

export async function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || ''

  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }

  const token = authorization.slice('Bearer '.length).trim()

  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }

  try {
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    }

    next()
  } catch (error) {
    next(error)
  }
}
