import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AuditLog {
  id: string;
  action: string;
  success: boolean;
  createdAt: string;
  userId?: string | null;
  role?: string | null;
  metadata?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface UserItem {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  isVerified: boolean;
  deletedAt?: string | null;
  createdAt?: string;
}

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [activeView, setActiveView] = useState<'users' | 'audit'>('users');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'RECEPTIONIST' });
  const [showPassword, setShowPassword] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'GROOMER',
    staffType: 'GROOMER',
    specialty: '',
    shift: '',
    phone: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, logsResponse] = await Promise.all([
        api.get<UserItem[]>('/users'),
        api.get<AuditLog[]>('/users/audit-logs'),
      ]);
      setUsers(usersResponse.data);
      setLogs(logsResponse.data);
    } catch {
      setUsers([]);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateStaff = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post('/auth/create-staff', {
        ...createForm,
        role: createForm.role,
        staffType: createForm.staffType,
      });
      setMessage('Usuario de personal creado correctamente.');
      setCreateForm({
        name: '',
        email: '',
        password: '',
        role: 'GROOMER',
        staffType: 'GROOMER',
        specialty: '',
        shift: '',
        phone: '',
      });
      fetchData();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'No se pudo crear el usuario.');
    }
  };

  const handleEditStart = (user: UserItem) => {
    setEditingUserId(user.id);
    setEditForm({ name: user.name || '', email: user.email, role: user.role });
  };

  const handleEditSave = async (userId: string) => {
    try {
      await api.patch(`/users/${userId}`, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      });
      setEditingUserId(null);
      setMessage('Usuario actualizado.');
      fetchData();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'No se pudo actualizar el usuario.');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await api.delete(`/users/${userId}`);
      setMessage('Usuario eliminado.');
      fetchData();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'No se pudo eliminar el usuario.');
    }
  };

  const stats = useMemo(() => ({
    admins: users.filter((user) => user.role === 'ADMIN').length,
    staff: users.filter((user) => user.role === 'GROOMER' || user.role === 'RECEPTIONIST').length,
    clients: users.filter((user) => user.role === 'CLIENT').length,
  }), [users]);

  return (
    <div className="min-h-[80vh] rounded-[2rem] border border-white/10 bg-black/40 p-3 shadow-2xl shadow-black/30 backdrop-blur lg:p-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="w-full rounded-[1.25rem] border border-white/10 bg-zinc-950/80 p-5 lg:w-72">
          <h2 className="text-xl font-semibold text-white">Admin</h2>
          <div className="mt-5 flex flex-col gap-2">
            <button className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${activeView === 'users' ? 'bg-red-600 text-white' : 'bg-white/5 text-stone-300 hover:bg-white/10'}`} onClick={() => setActiveView('users')}>
              Usuarios
            </button>
            <button className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${activeView === 'audit' ? 'bg-red-600 text-white' : 'bg-white/5 text-stone-300 hover:bg-white/10'}`} onClick={() => setActiveView('audit')}>
              Auditoría
            </button>
            <button onClick={logout} className="mt-3 rounded-2xl border border-red-500/30 bg-red-600/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-600 hover:text-white">Salir</button>
            <Link to="/profile" className="mt-2 rounded-2xl px-4 py-3 text-sm font-medium text-stone-300 transition hover:bg-white/10 hover:text-white">Perfil</Link>
          </div>
        </aside>

        <main className="flex-1 rounded-[1.25rem] border border-white/10 bg-zinc-950/60 p-5">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">Panel</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Administración</h2>
            <p className="mt-2 text-sm text-stone-400">Gestiona usuarios y revisa las acciones del sistema.</p>
          </div>

          {message ? <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div> : null}

          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4"><strong className="block text-2xl text-white">{stats.admins}</strong><span className="text-sm text-stone-400">Administradores</span></div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4"><strong className="block text-2xl text-white">{stats.staff}</strong><span className="text-sm text-stone-400">Personal</span></div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4"><strong className="block text-2xl text-white">{stats.clients}</strong><span className="text-sm text-stone-400">Clientes</span></div>
          </div>

          {activeView === 'users' ? (
            <>
              <section className="mb-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">Crear nuevo usuario de personal</h3>
                <form onSubmit={handleCreateStaff} className="mt-4 grid gap-3 md:grid-cols-2">
                  <input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="Nombre" required className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
                  <input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} placeholder="Correo" required className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />                                            
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={createForm.password}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          password: e.target.value,
                        })
                      }
                      placeholder="Contraseña"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 pr-10 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>

                  <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value, staffType: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-red-500">
                    <option value="GROOMER">Groomer</option>
                    <option value="RECEPTIONIST">Recepcionista</option>
                  </select>
                  <input value={createForm.specialty} onChange={(e) => setCreateForm({ ...createForm, specialty: e.target.value })} placeholder="Especialidad" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
                  <input value={createForm.shift} onChange={(e) => setCreateForm({ ...createForm, shift: e.target.value })} placeholder="Turno" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
                  <input value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} placeholder="Teléfono" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
                  <button type="submit" className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500">Crear usuario</button>
                </form>
              </section>

              <section className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">Listado de usuarios</h3>
                {loading ? <p className="mt-3 text-sm text-stone-400">Cargando usuarios...</p> : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-stone-300">
                      <thead>
                        <tr className="border-b border-white/10 text-stone-400">
                          <th className="px-2 py-3">Nombre</th>
                          <th className="px-2 py-3">Correo</th>
                          <th className="px-2 py-3">Rol</th>
                          <th className="px-2 py-3">Estado</th>
                          <th className="px-2 py-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-white/10">
                            <td className="px-2 py-3 text-white">{user.name || '—'}</td>
                            <td className="px-2 py-3">{user.email}</td>
                            <td className="px-2 py-3">{user.role}</td>
                            <td className="px-2 py-3">{user.isVerified ? 'Verificado' : 'Pendiente'}</td>
                            <td className="px-2 py-3">
                              <button className="mr-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-200 transition hover:border-red-500 hover:text-red-200" onClick={() => handleEditStart(user)}>Editar</button>
                              <button className="rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-600" onClick={() => handleDelete(user.id)}>Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {editingUserId ? (
                <section className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-semibold text-white">Editar usuario</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Nombre" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
                    <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Correo" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-red-500" />
                    <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-red-500">
                      <option value="ADMIN">Administrador</option>
                      <option value="GROOMER">Groomer</option>
                      <option value="RECEPTIONIST">Recepcionista</option>
                      <option value="CLIENT">Cliente</option>
                    </select>
                    <button className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500" onClick={() => handleEditSave(editingUserId)}>Guardar</button>
                    <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-stone-200 transition hover:border-red-500 hover:text-red-200" onClick={() => setEditingUserId(null)}>Cancelar</button>
                  </div>
                </section>
              ) : null}
            </>
          ) : (
            <section className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold text-white">Auditoría del sistema</h3>
              {loading ? <p className="mt-3 text-sm text-stone-400">Cargando auditoría...</p> : (
                logs.length === 0 ? (
                  <p className="mt-3 text-sm text-stone-400">No hay registros de auditoría aún.</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-stone-300">
                      <thead>
                        <tr className="border-b border-white/10 text-stone-400">
                          <th className="px-2 py-3">UsuarioId</th>
                          <th className="px-2 py-3">Usuario</th>
                          <th className="px-2 py-3">Acción</th>
                          <th className="px-2 py-3">Rol</th>
                          <th className="px-2 py-3">Estado</th>
                          <th className="px-2 py-3">Fecha</th>
                          <th className="px-2 py-3">Dirección IP</th>
                          <th className="px-2 py-3">Navegador</th>

                        </tr> 
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr key={log.id} className="border-b border-white/10">
                            <td className="px-2 py-3 text-white">{log.userId}</td>
                            <td className="px-2 py-3 text-white">{users.find((u) => u.id === log.userId)?.name || '—'}</td>
                            <td className="px-2 py-3 text-white">{log.action}</td>
                            <td className="px-2 py-3">{log.role || '—'}</td>
                            <td className="px-2 py-3">{log.success ? 'Éxito' : 'Fallido'}</td>
                            <td className="px-2 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                            <td className="px-2 py-3">{log.ipAddress}</td>
                            <td className="px-2 py-3">{log.userAgent}</td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
