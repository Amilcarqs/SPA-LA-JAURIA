import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    ci: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(value && !emailRegex.test(value) ? 'Ingresa un correo válido.' : '');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setEmailError('Ingresa un correo válido.');
      return;
    }

    if (form.password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }

    try {
      await api.post('/auth/register', form);
      setSuccess('Registro exitoso. Revisa tu correo para verificar la cuenta.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo registrar');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-[1.5rem] border border-white/10 bg-black/55 p-8 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">PetSpa</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Crear cuenta</h2>
          <p className="mt-2 text-sm text-stone-400">Tu registro será rápido y seguro.</p>
        </div>

        {error ? <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
        {success ? <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{success}</p> : null}

        <div className="grid gap-3 md:grid-cols-2">
          <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
          <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
          {emailError ? <p className="md:col-span-2 text-sm text-red-300">{emailError}</p> : null}
          
          
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          <input name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
          <input name="ci" placeholder="CI" value={form.ci} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
          <input name="address" placeholder="Dirección" value={form.address} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <PasswordStrengthMeter password={form.password} />
          <p className="mt-2 text-xs text-stone-400">Usa mayúsculas, minúsculas, números y un símbolo.</p>
        </div>

        <button type="submit" className="mt-6 w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500">Registrarse</button>

        <p className="mt-5 text-center text-sm text-stone-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-red-300 hover:text-red-200">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
