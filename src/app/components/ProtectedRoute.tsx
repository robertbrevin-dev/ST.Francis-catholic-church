import { Navigate } from 'react-router'
import { useAdmin } from '../../lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdmin()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#7c4c2e', fontSize: '14px' }}>Loading...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}