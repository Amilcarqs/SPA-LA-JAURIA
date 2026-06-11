import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { UserProfile } from '../types/auth';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    const response = await api.get<UserProfile>('/auth/profile');
    setProfile(response.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSetup2FA = async () => {
    setError('');
    setMessage('');
    const response = await api.post('/auth/2fa/setup', {});
    setSetupSecret(response.data.secret);
    setQrCodeDataUrl(response.data.qrCodeDataUrl);
    setMessage('Escanea este código QR con Google Authenticator.');
  };

  const handleEnable2FA = async () => {
    try {
      await api.post('/auth/2fa/enable', { token: twoFactorCode });
      setMessage('2FA activado correctamente.');
      setTwoFactorCode('');
      setQrCodeDataUrl('');
      setSetupSecret(null);
      await fetchProfile();
    } catch {
      setError('El código 2FA no es válido.');
    }
  };

  const handleDisable2FA = async () => {
    await api.post('/auth/2fa/disable', {});
    await fetchProfile();
    setMessage('2FA desactivado.');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[1.5rem] border border-white/10 bg-black/55 p-8 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">Seguridad</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Mi perfil</h2>
          <p className="mt-2 text-sm text-stone-400">Gestiona tu información y la autenticación de dos factores.</p>
        </div>

        {profile ? (
          <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-6 text-sm text-stone-300">
            <p><span className="text-stone-500">Nombre:</span> {profile.name || 'Sin nombre'}</p>
            <p className="mt-2"><span className="text-stone-500">Correo:</span> {profile.email}</p>
            <p className="mt-2"><span className="text-stone-500">Rol:</span> {profile.role}</p>
            <p className="mt-2"><span className="text-stone-500">Verificado:</span> {profile.isVerified ? 'Sí' : 'No'}</p>
            <p className="mt-2"><span className="text-stone-500">2FA:</span> {profile.twoFactorEnabled ? 'Activado' : 'Desactivado'}</p>
          </div>
        ) : (
          <p className="text-stone-400">Cargando perfil...</p>
        )}

        {message ? <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{message}</p> : null}
        {error ? <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}

        {!profile?.twoFactorEnabled ? (
          <div className="mt-6 flex flex-col gap-3">
            {!qrCodeDataUrl ? (
              <button onClick={handleSetup2FA} className="rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500">Activar 2FA</button>
            ) : (
              <>
                <img src={qrCodeDataUrl} alt="QR 2FA" className="mx-auto h-48 w-48 rounded-2xl border border-white/10 bg-white p-3" />
                <p className="text-center text-xs text-stone-400">Secreto: {setupSecret}</p>
                <input value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} placeholder="Código de 6 dígitos" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
                <button onClick={handleEnable2FA} className="rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500">Confirmar 2FA</button>
              </>
            )}
          </div>
        ) : (
          <button onClick={handleDisable2FA} className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-stone-200 transition hover:border-red-500 hover:text-red-200">Desactivar 2FA</button>
        )}

        <div className="mt-6">
          <button onClick={() => navigate(profile?.role === 'ADMIN' ? '/admin' : '/dashboard')} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-red-500 hover:text-red-200">
            {profile?.role === 'ADMIN' ? 'Volver al panel' : 'Volver'}
          </button>
        </div>
      </div>
    </div>
  );
}
