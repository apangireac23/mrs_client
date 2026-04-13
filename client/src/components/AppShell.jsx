import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function AppShell() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/auth', { replace: true })
  }

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : '?'

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <p className="sidebar-logo">Auteur Cinema</p>
          <p className="sidebar-tagline">MovieMatch Recommender</p>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.email}</p>
            <p className="sidebar-user-role">Premium Member</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-nav-label">Browse</p>

          <NavLink to="/app" end className="sidebar-link">
            <span className="material-icons-round">explore</span>
            <span>Discover</span>
          </NavLink>

          <NavLink to="/app/recommendations" className="sidebar-link">
            <span className="material-icons-round">auto_awesome</span>
            <span>Recommendations</span>
          </NavLink>

          <NavLink to="/app/watchlist" className="sidebar-link">
            <span className="material-icons-round">bookmark</span>
            <span>Watchlist</span>
          </NavLink>

          <NavLink to="/app/profile" className="sidebar-link">
            <span className="material-icons-round">history</span>
            <span>History</span>
          </NavLink>

          <div className="sidebar-divider" />
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-link"
            onClick={handleLogout}
            style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <span className="material-icons-round">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
