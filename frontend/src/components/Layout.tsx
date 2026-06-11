import type { ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout, token } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/verify-email'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.18),_transparent_35%),linear-gradient(135deg,_#0f0f0f_0%,_#171717_45%,_#212121_100%)] text-stone-100">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="text-xl font-semibold tracking-[0.2em] text-red-500">
            PETSPA
          </Link>
          <nav className="flex items-center gap-3 text-sm font-medium text-stone-300">
            <NavLink to="/" className={({ isActive }) => `rounded-full px-4 py-2 transition ${isActive ? 'bg-red-600 text-white' : 'hover:bg-white/10 hover:text-white'}`}>
              Inicio
            </NavLink>
            {!token ? (
              <NavLink to="/login" className={({ isActive }) => `rounded-full border border-red-500/50 px-4 py-2 text-red-200 transition hover:bg-red-600 hover:text-white ${isActive ? 'bg-red-600 text-white' : ''}`}>
                Iniciar sesión
              </NavLink>
            ) : (
              <>
                <NavLink to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
                  Panel
                </NavLink>
                <button onClick={logout} className="rounded-full border border-white/10 px-4 py-2 transition hover:border-red-500 hover:text-red-300">
                  Salir
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className={isAuthPage ? 'px-4 py-8 sm:px-6 lg:px-8' : 'px-4 py-8 sm:px-6 lg:px-8'}>
        {children}
      </main>
    </div>
  );
}
