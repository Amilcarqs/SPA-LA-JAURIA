import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessDeniedPage from '../pages/AccessDeniedPage';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;
  return user?.role === 'ADMIN' ? <Outlet /> : <AccessDeniedPage />;
}
