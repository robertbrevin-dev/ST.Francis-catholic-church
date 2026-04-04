import { Navigate } from "react-router"
import { useAdmin } from "../../lib/auth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdmin()

  if (loading) {
    return (
      <div className="admin-app-root" style={{ alignItems: "center", justifyContent: "center" }}>
        <div className="admin-loader" role="status" aria-label="Loading" />
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}