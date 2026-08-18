import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

/** Requiere sesión iniciada (cualquier rol). Si no hay sesión, redirige a /login. */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

/** Requiere sesión iniciada con rol ADMIN. Si no, redirige al inicio. */
export function AdminRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
