import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu cuenta...');
  const hasVerified = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token || hasVerified.current) {
      if (!token) {
        setStatus('error');
        setMessage('No se encontró el token de verificación.');
      }
      return;
    }

    hasVerified.current = true;

    api
      .get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('success');
        setMessage('Tu correo ha sido verificado correctamente. Ya puedes iniciar sesión.');
      })
      .catch((err) => {
        const backendMessage = err?.response?.data?.message || 'El enlace de verificación no es válido o ha expirado.';
        setStatus('error');
        setMessage(backendMessage + ' Si el enlace expiró, solicita uno nuevo.');
      });
  }, [searchParams]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-black/55 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">PetSpa</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">{status === 'success' ? '¡Cuenta verificada!' : 'Verificación de cuenta'}</h2>
        <p className={`mt-4 text-sm ${status === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>{message}</p>
        <button onClick={() => navigate('/login')} className="mt-6 rounded-full bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500">
          {status === 'success' ? 'Iniciar sesión' : 'Volver al inicio'}
        </button>
      </div>
    </div>
  );
}
