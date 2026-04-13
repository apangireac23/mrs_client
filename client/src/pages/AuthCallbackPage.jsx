import { useNavigate } from 'react-router-dom'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <div className="auth-card auth-callback-card">
        <div className="auth-card-header">
          <span className="material-icons-round" style={{ fontSize: '48px', color: 'var(--success-text)', marginBottom: '16px' }}>check_circle</span>
          <h1>Email Confirmed</h1>
          <p>Your email has been verified. You're ready to begin your cinematic journey.</p>
        </div>

        <button type="button" onClick={() => navigate('/auth')}>
          Continue to Sign In
        </button>
      </div>
    </div>
  )
}
