import { Navigate } from 'react-router-dom'

import { useAuth } from './AuthContext'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) return null
  if (!session) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
