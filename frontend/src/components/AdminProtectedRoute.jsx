import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from './Spinner.jsx'

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user || !['admin', 'superadmin'].includes(user.role)) return <Navigate to="/admin/login" replace />
  return children
}
