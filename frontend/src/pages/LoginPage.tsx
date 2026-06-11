import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { AuthResponse, UserProfile } from '../types/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      if (response.data.requires2FA) {
        setRequires2FA(true);
        setError('');
        return;
      }

      login(response.data);

      const profile = await api.get<UserProfile>('/auth/profile');
      setUser(profile.data);
      navigate(profile.data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;
      if (backendMessage?.includes('bloqueada')) {
        setError('Tu cuenta está bloqueada temporalmente por 15 minutos debido a varios intentos fallidos.');
      } else if (backendMessage?.includes('verificar')) {
        setError('Debes verificar tu correo antes de iniciar sesión.');
      } else {
        setError(backendMessage || 'No se pudo iniciar sesión. Revisa tus credenciales.');
      }
    }
  };

  const handleTwoFactorSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post<AuthResponse>('/auth/2fa/verify-login', { email, token: twoFactorCode });
      if (!response.data.access_token) {
        throw new Error('No se recibió token');
      }

      login(response.data);
      const profile = await api.get<UserProfile>('/auth/profile');
      setUser(profile.data);
      navigate(profile.data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch {
      setError('Código 2FA inválido. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <form onSubmit={requires2FA ? handleTwoFactorSubmit : handleSubmit} className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-black/55 p-8 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">PetSpa</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-stone-400">Accede a tu cuenta con seguridad reforzada.</p>
        </div>

        {error ? <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}

        {!requires2FA ? (
          <>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-stone-500 focus:border-red-500"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500"
            />
          </>
        ) : (
          <input
            type="text"
            inputMode="numeric"
            placeholder="Código 2FA"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            required
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500"
          />
        )}

        <button type="submit" className="mt-6 w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500">
          {requires2FA ? 'Verificar código' : 'Entrar'}
        </button>

        <p className="mt-5 text-center text-sm text-stone-400">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-red-300 hover:text-red-200">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
