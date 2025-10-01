import { Navigate, Outlet } from 'react-router'
import { useAuth } from './context/AuthContext'

function ProtectedRoute() {
    const { user } = useAuth()

    if (!user) return <Navigate to={'/login'} replace />

  return (
    <Outlet/>
  )
}

export default ProtectedRoute