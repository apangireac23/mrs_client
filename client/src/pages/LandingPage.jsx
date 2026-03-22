import { Link, Navigate } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuth } from '../hooks/useAuth'

export function LandingPage() {
  const { loading, session } = useAuth()

  if (loading) {
    return <div className="page-message landing-loading">Checking session...</div>
  }

  if (session) {
    return <Navigate to="/app" replace />
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div>
          <p className="eyebrow">Movie Recommendation System</p>
          <h1>Find your next movie faster.</h1>
          <p className="landing-copy">
            Sign in to browse titles, save likes and watches, and get personalized
            recommendations through the backend recommender flow.
          </p>
        </div>

        <ThemeToggle />
      </header>

      <section className="landing-panel">
        <div className="landing-grid">
          <article className="landing-card">
            <h2>Discover</h2>
            <p>Browse popular TMDB movies and search quickly.</p>
          </article>

          <article className="landing-card">
            <h2>Track</h2>
            <p>Save like, watch, and skip interactions through the Express BFF.</p>
          </article>

          <article className="landing-card">
            <h2>Recommend</h2>
            <p>Fetch personalized suggestions from your recommender service.</p>
          </article>
        </div>

        <div className="landing-actions">
          <Link to="/auth" className="landing-button primary-link-button">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  )
}
