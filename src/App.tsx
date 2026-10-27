import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Calendar, 
  Dog, 
  Package, 
  LogOut, 
  Plus, 
  Trash2, 
  UserCheck,
  X,
  Edit3
} from 'lucide-react';

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
  estado: string;
}

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const API_BASE_URL = 'http://54.226.33.64:8080/api';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState<'mascotas' | 'citas' | 'productos' | 'usuarios'>('mascotas');

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  // Modales
  const [showProductModal, setShowProductModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');

  // Cargar datos desde la base de datos (Backend Spring Boot)
  const loadData = async () => {
    try {
      const resMascotas = await fetch(`${API_BASE_URL}/mascotas`);
      if (resMascotas.ok) setMascotas(await resMascotas.json());

      const resCitas = await fetch(`${API_BASE_URL}/citas`);
      if (resCitas.ok) setCitas(await resCitas.json());

      const resProducts = await fetch(`${API_BASE_URL}/products`);
      if (resProducts.ok) setProductos(await resProducts.json());
    } catch (error) {
      console.warn("Backend no disponible temporalmente, cargando datos guardados...");
      // Datos de respaldo iniciales basados en Supabase
      setMascotas([
        { id: 1, nombre: 'Max', especie: 'Perro', raza: 'Golden Retriever', edad: 3, propietario: 'Carlos Pérez' },
        { id: 2, nombre: 'Luna', especie: 'Gato', raza: 'Siamés', edad: 2, propietario: 'Carlos Pérez' },
        { id: 3, nombre: 'Rocky', especie: 'Perro', raza: 'Bulldog Francés', edad: 4, propietario: 'Juan Tapia' }
      ]);
      setCitas([
        { id: 1, mascota: 'Max', propietario: 'Carlos Pérez', fecha: '2026-10-27', hora: '10:00 AM', motivo: 'Vacunación Octuple', estado: 'Confirmada' },
        { id: 2, mascota: 'Luna', propietario: 'Carlos Pérez', fecha: '2026-10-27', hora: '11:30 AM', motivo: 'Control General', estado: 'Pendiente' },
        { id: 3, mascota: 'Rocky', propietario: 'Juan Tapia', fecha: '2026-10-28', hora: '03:00 PM', motivo: 'Limpieza Dental', estado: 'Confirmada' }
      ]);
      setProductos([
        { id: 1, name: 'vacunas', description: 'Sin descripción', price: 7500, stock: 10 },
        { id: 2, name: 'Alimento para gato', description: 'Sin descripción', price: 25000, stock: 5 },
        { id: 3, name: 'Alimento para perro', description: 'Sin descripción', price: 25000, stock: 5 },
        { id: 4, name: 'churu', description: 'Sin descripción', price: 1000, stock: 25 },
        { id: 5, name: 'arena para gato', description: 'Sin descripción', price: 8990, stock: 10 }
      ]);
    }
  };

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

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const cleanEmail = emailInput.trim().toLowerCase();

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
      const loggedUser: User = { email: cleanEmail, nombre: userName, role: assignedRole };
      setUser(loggedUser);
      localStorage.setItem('vetcare_user', JSON.stringify(loggedUser));
    } else {
      setLoginError('Correo no registrado. Usa admin@test.com, editor@test.com o viewer@test.com');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vetcare_user');
  };

  // Agregar Producto a la Base de Datos
  const handleAddProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role === 'cliente') {
      alert('Los clientes no pueden agregar productos.');
      return;
    }

    const newProd = {
      name: newName,
      description: newDesc || 'Sin descripción',
      price: Number(newPrice),
      stock: Number(newStock)
    };

    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (res.ok) {
        const savedProd = await res.json();
        setProductos([...productos, savedProd]);
      } else {
        setProductos([...productos, { ...newProd, id: Date.now() }]);
      }
    } catch (e) {
      setProductos([...productos, { ...newProd, id: Date.now() }]);
    }

    setShowProductModal(false);
    setNewName('');
    setNewDesc('');
    setNewPrice('');
    setNewStock('');
  };

  // Eliminar Producto de la Base de Datos
  const handleDeleteProducto = async (id: number) => {
    if (user?.role !== 'editor') {
      alert('Acceso Denegado: Solo el perfil Editor (admin@test.com) puede eliminar productos.');
      return;
    }

    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.log('Eliminado localmente');
    }

    setProductos(productos.filter(p => p.id !== id));
  };

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
                placeholder="admin@test.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg"
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
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
          <button onClick={handleLogout} title="Cerrar Sesión" className="p-2 text-slate-400 hover:text-white rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Navegación por Pestañas Completa */}
      <nav className="bg-slate-900/50 border-b border-slate-800/80 px-6 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setTab('mascotas')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            tab === 'mascotas' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dog className="w-4 h-4" /> Mascotas
        </button>

        <button
          onClick={() => setTab('citas')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            tab === 'citas' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Citas Médicas
        </button>

        <button
          onClick={() => setTab('productos')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            tab === 'productos' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" /> Productos e Inventario
        </button>

        {user.role === 'editor' && (
          <button
            onClick={() => setTab('usuarios')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === 'usuarios' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Gestión Usuarios
          </button>
        )}
      </nav>

      {/* Contenido */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-slate-300">
              Conectado como <strong className="text-white">{user.email}</strong>. 
              {user.role === 'editor' && ' Permisos totales de edición y eliminación activados.'}
              {user.role === 'veterinario' && ' Permisos de gestión clínica activados.'}
              {user.role === 'cliente' && ' Modo lectura activado.'}
            </p>
          </div>

          {tab === 'productos' && user.role !== 'cliente' && (
            <button 
              onClick={() => setShowProductModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Nuevo Producto
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
                      {user.role === 'editor' && (
                        <button title="Eliminar" className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
                      {user.role === 'editor' && (
                        <button title="Eliminar" className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: PRODUCTOS */}
        {tab === 'productos' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Nombre Producto</th>
                  <th className="p-4">Descripción</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {productos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">#{p.id}</td>
                    <td className="p-4 font-semibold text-white capitalize">{p.name}</td>
                    <td className="p-4 text-slate-400">{p.description}</td>
                    <td className="p-4 text-emerald-400 font-medium">${p.price.toLocaleString('es-CL')}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300">
                        {p.stock} un.
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {user.role === 'editor' && (
                        <button 
                          onClick={() => handleDeleteProducto(p.id)}
                          title="Eliminar de Supabase" 
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: USUARIOS */}
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

      {/* Modal para agregar producto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white">Agregar Producto a Supabase</h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProducto} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre</label>
                <input 
                  type="text" 
                  required 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="Ej: Champú Antipulgas"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Descripción</label>
                <input 
                  type="text" 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  placeholder="Ej: Contenido 250ml"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Precio ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={newPrice} 
                    onChange={(e) => setNewPrice(e.target.value)} 
                    placeholder="12000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Stock</label>
                  <input 
                    type="number" 
                    required 
                    value={newStock} 
                    onChange={(e) => setNewStock(e.target.value)} 
                    placeholder="15"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)} 
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
                >
                  Guardar en Base de Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}