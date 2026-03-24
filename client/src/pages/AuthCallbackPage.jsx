import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <div className="auth-card auth-callback-card">
        <div className="auth-topbar">
          <div>
            <p className="eyebrow">Email Confirmed</p>
            <h1>Your email is confirmed</h1>
            <p className="auth-copy">Click below to continue to login.</p>
          </div>

          <ThemeToggle />
        </div>

        <button type="button" onClick={() => navigate('/auth')}>
          Click here to login
        </button>
      </div>
    </div>
  )
}
