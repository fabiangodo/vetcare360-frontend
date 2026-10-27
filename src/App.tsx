import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Shield, 
  Package, 
  LogOut, 
  Plus, 
  Trash2, 
  UserCheck,
  X,
  Edit3,
  ShoppingCart,
  CheckCircle2,
  Loader2
} from 'lucide-react';

// Cliente directo a Supabase
const supabaseUrl = 'https://ptrkxumyvnwecrnhfigr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0cmt4dW15dm53ZWNybmhmaWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NjY4MDMsImV4cCI6MjA0NTU0MjgwM30.4i4kUSs9N7mFj2a-430z4O17p7G1yS2vD0A0E0X0X0X0'; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Role = 'editor' | 'veterinario' | 'cliente';

interface User {
  email: string;
  nombre: string;
  role: Role;
}

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  // Modales
  const [showProductModal, setShowProductModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');

  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  // Cargar productos directamente desde Supabase
  const fetchProductos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data) {
      setProductos(data);
    }
    setLoading(false);
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
      fetchProductos();
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

  // Guardar Edición (Persiste en Supabase)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProductos(prev => prev.map(p => p.id === editingProduct.id ? { ...p, stock: editStock, price: editPrice } : p));
    setEditingProduct(null);

    await supabase
      .from('products')
      .update({ stock: editStock, price: editPrice })
      .eq('id', editingProduct.id);
  };

  // Comprar (Descuenta en Supabase)
  const handleBuyProduct = async (p: Producto) => {
    if (p.stock <= 0) {
      alert('Producto agotado.');
      return;
    }

    const newStockVal = p.stock - 1;
    setProductos(prev => prev.map(item => item.id === p.id ? { ...item, stock: newStockVal } : item));
    setPurchaseSuccess(`Compraste: ${p.name}`);
    setTimeout(() => setPurchaseSuccess(null), 3000);

    await supabase
      .from('products')
      .update({ stock: newStockVal })
      .eq('id', p.id);
  };

  // Agregar a Supabase
  const handleAddProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role === 'cliente') return;

    const { data } = await supabase
      .from('products')
      .insert([
        { name: newName, description: newDesc || 'Sin descripción', price: Number(newPrice), stock: Number(newStock) }
      ])
      .select();

    if (data && data.length > 0) {
      setProductos(prev => [...prev, data[0]]);
    }

    setShowProductModal(false);
    setNewName('');
    setNewDesc('');
    setNewPrice('');
    setNewStock('');
  };

  // Eliminar de Supabase
  const handleDeleteProducto = async (id: number) => {
    if (user?.role !== 'editor') {
      alert('Solo el perfil Editor puede eliminar productos.');
      return;
    }

    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    setProductos(prev => prev.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
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
            <p className="font-semibold text-slate-300 mb-2">Cuentas de prueba:</p>
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

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {purchaseSuccess && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold">{purchaseSuccess}</p>
          </div>
        )}

        <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-slate-300">
              Conectado como <strong className="text-white">{user.email}</strong>. 
              {user.role === 'editor' && ' Permisos totales activados.'}
              {user.role === 'veterinario' && ' Edición de stock activada.'}
              {user.role === 'cliente' && ' Haz clic en "Comprar" para descontar stock.'}
            </p>
          </div>

          {user.role !== 'cliente' && (
            <button 
              onClick={() => setShowProductModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Nuevo Producto
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
            <p className="text-sm">Cargando catálogo desde Supabase...</p>
          </div>
        ) : (
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
                          title="Comprar Producto"
                          className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 border border-emerald-500/30"
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
      </main>

      {/* Modal Editar */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Editar Stock en Supabase</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Stock / Cantidad</label>
                <input 
                  type="number" 
                  required 
                  value={editStock} 
                  onChange={(e) => setEditStock(Number(e.target.value))} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Precio ($)</label>
                <input 
                  type="number" 
                  required 
                  value={editPrice} 
                  onChange={(e) => setEditPrice(Number(e.target.value))} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 text-xs text-slate-400">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Agregar Producto</h3>
            <form onSubmit={handleAddProducto} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre</label>
                <input 
                  type="text" 
                  required 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
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
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 text-xs text-slate-400">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}