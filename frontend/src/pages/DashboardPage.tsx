import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { UserProfile } from '../types/auth';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    api.get<UserProfile>('/auth/profile').then((response) => setProfile(response.data));
  }, []);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-[1.5rem] border border-white/10 bg-black/55 p-8 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">Panel</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Mi perfil</h2>
          </div>
          <button onClick={logout} className="rounded-full border border-red-500/30 bg-red-600/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-600 hover:text-white">Salir</button>
        </div>

        {profile ? (
          <div className="grid gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-6 md:grid-cols-2">
            <div className="space-y-3 text-sm text-stone-300">
              <p><span className="text-stone-500">Nombre:</span> {profile.name || 'Sin nombre'}</p>
              <p><span className="text-stone-500">Correo:</span> {profile.email}</p>
            </div>
            <div className="space-y-3 text-sm text-stone-300">
              <p><span className="text-stone-500">Rol:</span> {profile.role}</p>
              <p><span className="text-stone-500">Verificado:</span> {profile.isVerified ? 'Sí' : 'No'}</p>
            </div>
          </div>
        ) : (
          <p className="text-stone-400">Cargando perfil...</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {user?.role === 'ADMIN' ? (
            <button onClick={() => navigate('/admin')} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500">Volver al panel</button>
          ) : null}
          <button onClick={() => navigate('/profile')} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-red-500 hover:text-red-200">Gestionar 2FA</button>
        </div>
      </div>
    </div>
  );
}
