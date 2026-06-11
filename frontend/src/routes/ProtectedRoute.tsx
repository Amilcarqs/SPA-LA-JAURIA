import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
