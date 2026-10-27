import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Shield, 
  LogOut, 
  Plus, 
  Trash2, 
  UserCheck, 
  Edit3, 
  ShoppingCart, 
  CheckCircle2, 
  Loader2,
  Dog,
  Calendar,
  Package,
  Users,
  X
} from 'lucide-react';

const supabaseUrl = 'https://ptrkxumyvnwecrnhfigr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0cmt4dW15dm53ZWNybmhmaWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0Mjg0MDksImV4cCI6MjEwNTAwNDQwOX0.qN76kRzW9Ba9xhIuGHZW6PefNMkCcNQl8_mdTfCRXY0'; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'editor' | 'veterinario' | 'cliente';

interface User {
  email: string;
  nombre: string;
  role: UserRole;
}

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
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
}

interface UsuarioBD {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'mascotas' | 'citas' | 'productos' | 'usuarios'>('mascotas');

  // Listas de datos desde Supabase
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [usuariosBD, setUsuariosBD] = useState<UsuarioBD[]>([]);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modales
  const [showModal, setShowModal] = useState(false);

  // Formulario Mascotas
  const [mNombre, setMNombre] = useState('');
  const [mEspecie, setMEspecie] = useState('');
  const [mRaza, setMRaza] = useState('');
  const [mEdad, setMEdad] = useState('');
  const [mPropietario, setMPropietario] = useState('');

  // Formulario Productos
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');

  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Cargar datos
  const fetchAllData = async () => {
    setLoading(true);

    const resMascotas = await supabase.from('mascotas').select('*').order('id', { ascending: true });
    if (resMascotas.data) setMascotas(resMascotas.data);

    const resCitas = await supabase.from('citas').select('*').order('id', { ascending: true });
    if (resCitas.data) setCitas(resCitas.data);

    const resProd = await supabase.from('products').select('*').order('id', { ascending: true });
    if (resProd.data) setProductos(resProd.data);

    const resUsers = await supabase.from('usuarios').select('*').order('id', { ascending: true });
    if (resUsers.data) setUsuariosBD(resUsers.data);

    setLoading(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('vetcare_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('vetcare_user');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const cleanEmail = emailInput.trim().toLowerCase();

    let assignedRole: UserRole | null = null;
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

  // --- MASCOTAS ---
  const handleAddMascota = async (e: React.FormEvent) => {
    e.preventDefault();
    const newObj = {
      nombre: mNombre,
      especie: mEspecie,
      raza: mRaza,
      edad: Number(mEdad),
      propietario: mPropietario
    };

    const { data, error } = await supabase.from('mascotas').insert([newObj]).select();
    if (!error && data) {
      setMascotas(prev => [...prev, data[0]]);
      showNotification('Mascota registrada correctamente');
    }
    setShowModal(false);
    setMNombre(''); setMEspecie(''); setMRaza(''); setMEdad(''); setMPropietario('');
  };

  const handleDeleteMascota = async (id: number) => {
    if (!confirm('¿Eliminar esta mascota?')) return;
    setMascotas(prev => prev.filter(m => m.id !== id));
    await supabase.from('mascotas').delete().eq('id', id);
    showNotification('Mascota eliminada de la base de datos');
  };

  // --- PRODUCTOS ---
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updatedProd = { ...editingProduct, stock: editStock, price: editPrice };
    setProductos(prev => prev.map(p => p.id === editingProduct.id ? updatedProd : p));
    setEditingProduct(null);

    await supabase.from('products').update({ stock: editStock, price: editPrice }).eq('id', editingProduct.id);
    showNotification('Stock actualizado');
  };

  const handleBuyProduct = async (p: Producto) => {
    if (p.stock <= 0) return alert('Producto sin stock disponible.');
    const newStockVal = p.stock - 1;
    setProductos(prev => prev.map(item => item.id === p.id ? { ...item, stock: newStockVal } : item));
    showNotification(`Compraste: ${p.name}`);

    await supabase.from('products').update({ stock: newStockVal }).eq('id', p.id);
  };

  const handleAddProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProd = { name: newName, description: newDesc || 'Sin descripción', price: Number(newPrice), stock: Number(newStock) };
    const { data, error } = await supabase.from('products').insert([newProd]).select();
    if (!error && data) {
      setProductos(prev => [...prev, data[0]]);
      showNotification('Producto guardado');
    }
    setShowModal(false);
    setNewName(''); setNewDesc(''); setNewPrice(''); setNewStock('');
  };

  const handleDeleteProducto = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return;
    setProductos(prev => prev.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
    showNotification('Producto eliminado');
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
            <span className="text-xs text-emerald-400 font-medium">Conexión Supabase Activa</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user.nombre}</p>
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Rol: {user.role}
            </span>
          </div>
          <button onClick={handleLogout} title="Cerrar Sesión" className="p-2 text-slate-400 hover:text-white rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Navegación por Pestañas */}
      <nav className="bg-slate-900/50 border-b border-slate-800/80 px-6 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('mascotas')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'mascotas' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dog className="w-4 h-4" /> Mascotas
        </button>

        <button
          onClick={() => setActiveTab('citas')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'citas' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Citas Médicas
        </button>

        <button
          onClick={() => setActiveTab('productos')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'productos' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" /> Productos e Inventario
        </button>

        {/* Únicamente visible para el rol Administrador / Editor */}
        {user.role === 'editor' && (
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'usuarios' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Cuentas Registradas (Admin)
          </button>
        )}
      </nav>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {successMessage && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold">{successMessage}</p>
          </div>
        )}

        <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-slate-300">
              Conectado como <strong className="text-white">{user.email}</strong> ({user.role}).
            </p>
          </div>

          {user.role !== 'cliente' && activeTab !== 'citas' && activeTab !== 'usuarios' && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> 
              {activeTab === 'mascotas' && 'Registrar Mascota'}
              {activeTab === 'productos' && 'Nuevo Producto'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
            <p className="text-sm">Sincronizando datos con Supabase...</p>
          </div>
        ) : (
          <>
            {/* VISTA 1: MASCOTAS */}
            {activeTab === 'mascotas' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Especie</th>
                      <th className="p-4">Raza</th>
                      <th className="p-4">Edad</th>
                      <th className="p-4">Propietario</th>
                      {user.role !== 'cliente' && <th className="p-4 text-right">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {mascotas.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/30">
                        <td className="p-4 font-mono text-xs text-slate-500">#{m.id}</td>
                        <td className="p-4 font-bold text-white capitalize">{m.nombre}</td>
                        <td className="p-4">{m.especie}</td>
                        <td className="p-4 text-slate-400">{m.raza}</td>
                        <td className="p-4">{m.edad} años</td>
                        <td className="p-4 text-emerald-400 font-medium">{m.propietario}</td>
                        {user.role !== 'cliente' && (
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleDeleteMascota(m.id)}
                              className="p-1.5 bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-slate-700 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VISTA 2: CITAS MÉDICAS */}
            {activeTab === 'citas' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Mascota</th>
                      <th className="p-4">Propietario</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Hora</th>
                      <th className="p-4">Motivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {citas.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30">
                        <td className="p-4 font-mono text-xs text-slate-500">#{c.id}</td>
                        <td className="p-4 font-bold text-white capitalize">{c.mascota}</td>
                        <td className="p-4">{c.propietario}</td>
                        <td className="p-4 text-emerald-400">{c.fecha}</td>
                        <td className="p-4">{c.hora}</td>
                        <td className="p-4 text-slate-400">{c.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VISTA 3: PRODUCTOS */}
            {activeTab === 'productos' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase border-b border-slate-800">
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
                      <tr key={p.id} className="hover:bg-slate-800/30">
                        <td className="p-4 font-mono text-xs text-slate-500">#{p.id}</td>
                        <td className="p-4 font-bold text-white capitalize">{p.name}</td>
                        <td className="p-4 text-slate-400">{p.description}</td>
                        <td className="p-4 text-emerald-400 font-medium">${p.price.toLocaleString('es-CL')}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            p.stock === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            p.stock <= 5 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {p.stock === 0 ? 'Agotado' : `${p.stock} un.`}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleBuyProduct(p)}
                              disabled={p.stock === 0}
                              className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 border border-emerald-500/30"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" /> Comprar
                            </button>

                            {user.role !== 'cliente' && (
                              <button
                                onClick={() => { setEditingProduct(p); setEditStock(p.stock); setEditPrice(p.price); }}
                                className="p-1.5 bg-slate-800 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 border border-slate-700 rounded-lg"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}

                            {user.role === 'editor' && (
                              <button 
                                onClick={() => handleDeleteProducto(p.id)}
                                className="p-1.5 bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-slate-700 rounded-lg"
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

            {/* VISTA 4: USUARIOS (Solo para Admin / Editor) */}
            {activeTab === 'usuarios' && user.role === 'editor' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Nombre Usuario</th>
                      <th className="p-4">Correo</th>
                      <th className="p-4">Rol Asignado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {usuariosBD.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30">
                        <td className="p-4 font-mono text-xs text-slate-500">#{u.id}</td>
                        <td className="p-4 font-bold text-white">{u.nombre}</td>
                        <td className="p-4 text-emerald-400">{u.email}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                            {u.rol}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal dinámico */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white">
                {activeTab === 'mascotas' && 'Registrar Nueva Mascota'}
                {activeTab === 'productos' && 'Agregar Producto'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTab === 'mascotas' && (
              <form onSubmit={handleAddMascota} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre</label>
                  <input type="text" required value={mNombre} onChange={(e) => setMNombre(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Especie</label>
                    <input type="text" required placeholder="Perro / Gato" value={mEspecie} onChange={(e) => setMEspecie(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Edad</label>
                    <input type="number" required value={mEdad} onChange={(e) => setMEdad(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Raza</label>
                  <input type="text" required value={mRaza} onChange={(e) => setMRaza(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Propietario</label>
                  <input type="text" required value={mPropietario} onChange={(e) => setMPropietario(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-slate-400">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg">Guardar</button>
                </div>
              </form>
            )}

            {activeTab === 'productos' && (
              <form onSubmit={handleAddProducto} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre</label>
                  <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Descripción</label>
                  <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Precio ($)</label>
                    <input type="number" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Stock</label>
                    <input type="number" required value={newStock} onChange={(e) => setNewStock(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-slate-400">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg">Guardar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Editar Stock */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Editar Stock</h3>
            <form onSubmit={handleSaveEditProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Stock / Cantidad</label>
                <input type="number" required value={editStock} onChange={(e) => setEditStock(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Precio ($)</label>
                <input type="number" required value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 text-xs text-slate-400">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}