import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const commonEmailDomains = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'rediffmail.com',
  'icloud.com',
  'live.com',
]

const domainSuggestions = {
  'goggle.com': 'gmail.com',
  'googlemail.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'otlook.com': 'outlook.com',
  'hotmal.com': 'hotmail.com',
  'redifmail.com': 'rediffmail.com',
}

export function AuthPage() {
  const { session } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  if (session) {
    return <Navigate to="/app" replace />
  }

  function resetCredentials(nextMode) {
    setMode(nextMode)
    setEmail('')
    setPassword('')
    setError('')
    setMessage('')
  }

  function validateEmailAddress(value) {
    const normalizedEmail = value.trim().toLowerCase()
    const [, domain = ''] = normalizedEmail.split('@')

    if (!domain) {
      return 'Enter a valid email address.'
    }

    if (domainSuggestions[domain]) {
      return `Did you mean ${normalizedEmail.replace(domain, domainSuggestions[domain])}?`
    }

    if (!commonEmailDomains.includes(domain)) {
      return 'Use a common email domain like gmail.com, outlook.com, yahoo.com, or rediffmail.com.'
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const emailValidationError = validateEmailAddress(email)

    if (emailValidationError) {
      setError(emailValidationError)
      setMessage('')
      setPassword('')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    const action =
      mode === 'login'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })

    const { data, error: authError } = await action

    if (authError) {
      setError(authError.message)
      setPassword('')
      setLoading(false)
      return
    }

    if (mode === 'signup' && !data.session) {
      setMessage('Signup succeeded. Check your email to confirm your account, then log in.')
    }

    setEmail('')
    setPassword('')
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-topbar">
          <div>
            <p className="eyebrow">Supabase Auth</p>
            <h1>{mode === 'login' ? 'Login' : 'Create account'}</h1>
            <p className="auth-copy">
              Sign in to browse movies, log interactions, and fetch recommendations.
            </p>
          </div>

          <ThemeToggle />
        </div>

        <div className="mode-toggle">
          <button
            className={mode === 'login' ? 'active' : ''}
            type="button"
            onClick={() => resetCredentials('login')}
          >
            Login
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            type="button"
            onClick={() => resetCredentials('signup')}
          >
            Signup
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            name="fake-username"
            autoComplete="username"
            className="hidden-autofill-field"
            tabIndex="-1"
            aria-hidden="true"
          />

          <label>
            Email
            <input
              type="email"
              name="auth-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="off"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="auth-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : mode === 'login' ? 'Login' : 'Signup'}
          </button>
        </form>

        {error ? <p className="form-error">{error}</p> : null}
        {message ? <p className="form-success">{message}</p> : null}
      </div>
    </div>
  )
}
