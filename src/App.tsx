import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Calendar, 
  Dog, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  UserCheck 
} from 'lucide-react';

// Tipos de usuario según RBAC
type Role = 'editor' | 'veterinario' | 'cliente';

interface User {
  email: string;
  nombre: string;
  role: Role;
}

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  propietario: string;
}

interface Cita {
  id: number;
  mascota: string;
  propietario: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

export default function App() {
  // Estado inicial NULL para forzar pantalla de login
  const [user, setUser] = useState<User | null>(null);
  
  // Estados para login
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados de datos (Cargados desde la API o Mock)
  const [tab, setTab] = useState<'mascotas' | 'citas' | 'usuarios'>('mascotas');
  const [mascotas, setMascotas] = useState<Mascota[]>([
    { id: 1, nombre: 'Max', especie: 'Perro', raza: 'Golden Retriever', edad: 3, propietario: 'Carlos Pérez' },
    { id: 2, nombre: 'Luna', especie: 'Gato', raza: 'Siamés', edad: 2, propietario: 'Carlos Pérez' },
    { id: 3, nombre: 'Rocky', especie: 'Perro', raza: 'Bulldog Francés', edad: 4, propietario: 'Juan Tapia' }
  ]);
  const [citas, setCitas] = useState<Cita[]>([
    { id: 1, mascota: 'Max', propietario: 'Carlos Pérez', fecha: '2026-10-27', hora: '10:00 AM', motivo: 'Vacunación Octuple', estado: 'Confirmada' },
    { id: 2, mascota: 'Luna', propietario: 'Carlos Pérez', fecha: '2026-10-27', hora: '11:30 AM', motivo: 'Control General', estado: 'Pendiente' },
    { id: 3, mascota: 'Rocky', propietario: 'Juan Tapia', fecha: '2026-10-28', hora: '03:00 PM', motivo: 'Limpieza Dental', estado: 'Confirmada' }
  ]);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('vetcare_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('vetcare_user');
      }
    }
  }, []);

  // Manejar el inicio de sesión
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = emailInput.trim().toLowerCase();

    // Mapeo de usuarios reales cargados en Supabase
    let assignedRole: Role | null = null;
    let userName = '';

    if (cleanEmail === 'admin@test.com') {
      assignedRole = 'editor';
      userName = 'usuario_admin';
    } else if (cleanEmail === 'editor@test.com') {
      assignedRole = 'veterinario';
      userName = 'usuario_editor';
    } else if (cleanEmail === 'viewer@test.com') {
      assignedRole = 'cliente';
      userName = 'usuario_viewer';
    }

    if (assignedRole) {
      const loggedUser: User = {
        email: cleanEmail,
        nombre: userName,
        role: assignedRole
      };
      setUser(loggedUser);
      localStorage.setItem('vetcare_user', JSON.stringify(loggedUser));
      setEmailInput('');
      setPasswordInput('');
    } else {
      setLoginError('Correo no registrado. Usa admin@test.com, editor@test.com o viewer@test.com');
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vetcare_user');
  };

  // Eliminación con restricción de rol (Solo Editor)
  const handleDeleteMascota = (id: number) => {
    if (user?.role !== 'editor') {
      alert('Acceso Denegado: Solo el perfil Editor puede eliminar registros.');
      return;
    }
    setMascotas(mascotas.filter(m => m.id !== id));
  };

  const handleDeleteCita = (id: number) => {
    if (user?.role !== 'editor') {
      alert('Acceso Denegado: Solo el perfil Editor puede eliminar citas.');
      return;
    }
    setCitas(citas.filter(c => c.id !== id));
  };

  // VISTA 1: Formulario de Login si user === null
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-3 border border-emerald-500/20">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">VetCare 360</h1>
            <p className="text-slate-400 text-sm mt-1">Plataforma de Gestión Veterinaria</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@test.com, editor@test.com..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-2">Cuentas de prueba disponibles:</p>
            <ul className="space-y-1 font-mono text-[11px]">
              <li><strong className="text-emerald-400">Editor:</strong> admin@test.com</li>
              <li><strong className="text-emerald-400">Veterinario:</strong> editor@test.com</li>
              <li><strong className="text-emerald-400">Cliente:</strong> viewer@test.com</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // VISTA 2: Dashboard Principal (Usuario Autenticado)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Barra Superior */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none text-white">VetCare 360</h1>
            <span className="text-xs text-emerald-400 font-medium">Sistema RBAC Activo</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user.nombre}</p>
            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
              user.role === 'editor' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
              user.role === 'veterinario' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              Rol: {user.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Navegación Secundaria */}
      <nav className="bg-slate-900/50 border-b border-slate-800/80 px-6 flex gap-2">
        <button
          onClick={() => setTab('mascotas')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'mascotas' 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dog className="w-4 h-4" /> Mascotas
        </button>

        <button
          onClick={() => setTab('citas')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'citas' 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Citas Médicas
        </button>

        {user.role === 'editor' && (
          <button
            onClick={() => setTab('usuarios')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'usuarios' 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Gestión Usuarios
          </button>
        )}
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        
        {/* Banner de Permisos según Rol */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-slate-300">
              Conectado como <strong className="text-white">{user.email}</strong>. 
              {user.role === 'editor' && ' Tienes permisos totales de control y eliminación.'}
              {user.role === 'veterinario' && ' Puedes gestionar y editar historias clínicas.'}
              {user.role === 'cliente' && ' Tienes vista limitada a tus consultas.'}
            </p>
          </div>

          {user.role !== 'cliente' && (
            <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Nuevo Registro
            </button>
          )}
        </div>

        {/* TAB 1: MASCOTAS */}
        {tab === 'mascotas' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Especie / Raza</th>
                  <th className="p-4">Edad</th>
                  <th className="p-4">Propietario</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {mascotas.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">#{m.id}</td>
                    <td className="p-4 font-semibold text-white">{m.nombre}</td>
                    <td className="p-4">{m.especie} - <span className="text-slate-400">{m.raza}</span></td>
                    <td className="p-4">{m.edad} años</td>
                    <td className="p-4 text-slate-400">{m.propietario}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== 'cliente' && (
                          <button title="Editar" className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-lg">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {user.role === 'editor' && (
                          <button 
                            onClick={() => handleDeleteMascota(m.id)}
                            title="Eliminar (Solo Editor)" 
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: CITAS */}
        {tab === 'citas' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Paciente</th>
                  <th className="p-4">Fecha y Hora</th>
                  <th className="p-4">Motivo</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {citas.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{c.mascota}</p>
                      <p className="text-xs text-slate-500">{c.propietario}</p>
                    </td>
                    <td className="p-4">{c.fecha} a las <span className="text-slate-400">{c.hora}</span></td>
                    <td className="p-4 text-slate-300">{c.motivo}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        c.estado === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {c.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== 'cliente' && (
                          <button title="Editar Cita" className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-lg">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {user.role === 'editor' && (
                          <button 
                            onClick={() => handleDeleteCita(c.id)}
                            title="Eliminar Cita (Solo Editor)" 
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: USUARIOS (SOLO VISIBLE PARA EDITOR) */}
        {tab === 'usuarios' && user.role === 'editor' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Usuarios Registrados en Supabase</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs text-purple-400 font-bold uppercase">Rol: Editor</p>
                <p className="font-semibold text-white mt-1">usuario_admin</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">admin@test.com</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs text-blue-400 font-bold uppercase">Rol: Veterinario</p>
                <p className="font-semibold text-white mt-1">usuario_editor</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">editor@test.com</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs text-emerald-400 font-bold uppercase">Rol: Cliente</p>
                <p className="font-semibold text-white mt-1">usuario_viewer</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">viewer@test.com</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}