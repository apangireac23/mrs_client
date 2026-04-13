import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
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
        <div className="auth-card-header">
          <h1>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</h1>
          <p>Experience the art of cinematic curation</p>
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
            Email Address
            <input
              type="email"
              name="auth-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="off"
              placeholder="you@example.com"
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
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {error ? <p className="form-error">{error}</p> : null}
        {message ? <p className="form-success">{message}</p> : null}

        <div className="auth-footer">
          {mode === 'login' ? (
            <p>
              New to the theater?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); resetCredentials('signup') }}>
                Create an account
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); resetCredentials('login') }}>
                Sign in
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
