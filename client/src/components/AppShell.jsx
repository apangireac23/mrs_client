import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function AppShell() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/auth', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Movie Recommendation System</p>
          <h1>Movie Hub</h1>
        </div>

        <div className="header-actions">
          <ThemeToggle />
          <span className="user-chip">{user?.email}</span>
          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        <NavLink to="/app" end>
          Discover
        </NavLink>
        <NavLink to="/app/recommendations">Recommendations</NavLink>
        <NavLink to="/app/profile">History</NavLink>
      </nav>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
