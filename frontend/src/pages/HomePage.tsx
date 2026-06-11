import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Gestión profesional',
    text: 'Administra usuarios, turnos y operaciones con una experiencia clara y segura.',
  },
  {
    title: 'Seguridad reforzada',
    text: 'Autenticación, verificación por correo y 2FA para cuidar tus datos.',
  },
  {
    title: 'Experiencia premium',
    text: 'Un sistema pensado para que clientes, groomers y recepción tengan acceso rápido.',
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 py-8 lg:py-12">
      <section className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-8 shadow-2xl shadow-black/40 lg:grid-cols-[1.15fr_0.85fr] lg:p-14">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-200">
            Bienvenido a PetSpa
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Gestiona tu spa canino con estilo, seguridad y orden.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-300">
            Una plataforma moderna para clientes, groomers y recepción, con paneles intuitivos y acceso protegido.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/login" className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500">
              Iniciar sesión
            </Link>
            <Link to="/register" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-stone-100 transition hover:border-red-500 hover:text-red-200">
              Crear cuenta
            </Link>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-red-600/20 via-stone-900 to-black p-6">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-red-300">Vista general</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-black/40 p-4">
                <p className="text-sm text-stone-400">Usuarios activos</p>
                <p className="mt-1 text-3xl font-semibold text-white">24</p>
              </div>
              <div className="rounded-2xl bg-black/40 p-4">
                <p className="text-sm text-stone-400">Reservas del día</p>
                <p className="mt-1 text-3xl font-semibold text-white">12</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
            <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">{feature.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
