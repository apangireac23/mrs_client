import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function LandingPage() {
  const { loading, session } = useAuth()

  if (loading) {
    return (
      <div className="landing-page" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="loading-indicator">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
      </div>
    )
  }

  if (session) {
    return <Navigate to="/app" replace />
  }

  return (
    <div className="landing-page">
      {/* === Navigation === */}
      <nav className="landing-nav">
        <span className="landing-nav-brand">Auteur Cinema</span>
        <ul className="landing-nav-links">
          <li><a href="#features">Discover</a></li>
          <li><a href="#features">Recommendations</a></li>
          <li>
            <Link to="/auth" className="primary-link-button" style={{ padding: '10px 24px', fontSize: '0.8125rem' }}>
              Sign In
            </Link>
          </li>
        </ul>
      </nav>

      {/* === Hero Section === */}
      <section className="landing-hero">
        <span className="landing-hero-eyebrow">Personalized Cinema Experience</span>
        <h1>Find your next cinematic masterpiece.</h1>
        <p className="landing-hero-copy">
          Personalized suggestions powered by AI and TMDB. Browse, track, and discover
          your cinematic journey with a premium editorial experience.
        </p>
        <div className="landing-hero-actions">
          <Link to="/auth" className="primary-link-button">
            Get Started
          </Link>
          <a href="#features" className="secondary-link-button">
            <span className="material-icons-round" style={{ fontSize: '18px' }}>play_circle</span>
            See How It Works
          </a>
        </div>
      </section>

      {/* === Feature Cards === */}
      <section id="features" className="landing-features">
        <div className="landing-features-grid">
          <article className="landing-feature-card">
            <div className="feature-icon">
              <span className="material-icons-round">explore</span>
            </div>
            <h2>Discover</h2>
            <p>
              Browse popular TMDB movies with a curated editorial lens.
              Deep dive into metadata, trailers, and director spotlights.
            </p>
          </article>

          <article className="landing-feature-card">
            <div className="feature-icon">
              <span className="material-icons-round">bookmark</span>
            </div>
            <h2>Track</h2>
            <p>
              Save like, watch, and skip interactions to build your digital archive.
              Your taste profile evolves with every interaction.
            </p>
          </article>

          <article className="landing-feature-card">
            <div className="feature-icon">
              <span className="material-icons-round">auto_awesome</span>
            </div>
            <h2>Recommend</h2>
            <p>
              Fetch personalized suggestions powered by sophisticated AI that
              understands your cinematic soul beyond simple genres.
            </p>
          </article>
        </div>
      </section>

      {/* === Stats Section === */}
      <section className="landing-stats">
        <div className="landing-stats-grid">
          <article className="landing-stat-card">
            <h3>The Art of Storytelling</h3>
            <p>
              Our engine analyzes visual style, pacing, and narrative depth to find
              movies that truly resonate with your unique sensibilities.
            </p>
          </article>
          <article className="landing-stat-card">
            <h3>Join 20k+ Film Lovers</h3>
            <p>
              Elevating the cinematic discovery experience. We treat every
              recommendation as a premiere, ensuring you never settle for mediocre entertainment.
            </p>
          </article>
        </div>
      </section>

      {/* === Footer === */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/auth">Discover</Link></li>
              <li><Link to="/auth">Recommendations</Link></li>
              <li><Link to="/auth">Community</Link></li>
            </ul>
          </div>
          <div className="landing-footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">API Docs</a></li>
            </ul>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p>&copy; 2026 Auteur Cinema. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
