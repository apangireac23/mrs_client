import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }) {
  const { loading, session } = useAuth()

  if (loading) {
    return <div className="page-message">Checking session...</div>
  }

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  return children
}
