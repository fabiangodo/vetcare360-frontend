import React, { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
}

export default function App() {
  const auth = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensajeStatus, setMensajeStatus] = useState<string>('Ninguna petición enviada aún.');
  const [nuevoProducto, setNuevoProducto] = useState<Producto>({ nombre: '', precio: 0, stock: 0, descripcion: '' });
  const [fichas, setFichas] = useState<any>(null);

  const API_URL = 'https://oepttvmqv2.execute-api.us-east-1.amazonaws.com';

  const userRoles: string[] = auth.user?.profile?.['cognito:groups'] as string[] || [];
  const isAdmin = userRoles.includes('Admin');
  const isVet = userRoles.includes('Veterinario') || isAdmin;

  useEffect(() => {
    if (auth.isAuthenticated) {
      cargarProductos();
    }
  }, [auth.isAuthenticated]);

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`, {
        headers: { Authorization: `Bearer ${auth.user?.id_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      } else {
        setMensajeStatus(`Error al cargar productos: ${res.status}`);
      }
    } catch (err) {
      setMensajeStatus('Error de conexión con la API.');
    }
  };

  const probarHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/health`);
      const data = await res.json();
      setMensajeStatus(JSON.stringify(data));
    } catch {
      setMensajeStatus('Error al conectar con /health');
    }
  };

  const crearProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user?.id_token}`
        },
        body: JSON.stringify(nuevoProducto)
      });
      if (res.ok) {
        setNuevoProducto({ nombre: '', precio: 0, stock: 0, descripcion: '' });
        cargarProductos();
        setMensajeStatus('Producto creado exitosamente.');
      } else {
        setMensajeStatus(`No tienes permiso para crear productos (${res.status}).`);
      }
    } catch {
      setMensajeStatus('Error al enviar la petición.');
    }
  };

  const eliminarProducto = async (id?: number) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.user?.id_token}` }
      });
      if (res.ok) {
        cargarProductos();
        setMensajeStatus('Producto eliminado.');
      } else {
        setMensajeStatus(`Error al eliminar (${res.status}). Requiere rol Admin.`);
      }
    } catch {
      setMensajeStatus('Error al conectar.');
    }
  };

  const cargarFichasMedicas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/veterinario/fichas`, {
        headers: { Authorization: `Bearer ${auth.user?.id_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFichas(data);
      } else {
        setMensajeStatus(`Acceso denegado a Fichas Médicas (${res.status}).`);
      }
    } catch {
      setMensajeStatus('Error de conexión.');
    }
  };

  const cerrarSesion = () => {
    auth.removeUser();
    const cognitoDomain = "https://us-east-1gz8tiv6dd.auth.us-east-1.amazoncognito.com";
    const clientId = "3j84mt3n833o1qucrr2uuo3ohc";
    const logoutRedirect = "http://localhost:5173/";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutRedirect)}`;
  };

  if (!auth.isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>🚀 Sistema VetCare 360 - Acceso</h2>
          <button style={styles.btnPrimary} onClick={() => auth.signinRedirect()}>
            Iniciar Sesión con Cognito
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2>🚀 VetCare 360 - Dashboard</h2>

        <div style={styles.card}>
          <h3>👤 Perfil del Usuario</h3>
          <p><strong>Email:</strong> {auth.user?.profile?.email}</p>
          <p>
            <strong>Roles Asignados:</strong>{' '}
            {userRoles.map((rol) => (
              <span key={rol} style={styles.badge}>{rol}</span>
            ))}
          </p>
          <button style={styles.btnDanger} onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>

        <div style={styles.card}>
          <h3>⚡ Pruebas Backend (API Gateway)</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={styles.btnSuccess} onClick={probarHealth}>
              Ver Estado Backend (Público)
            </button>
            {isVet && (
              <button style={styles.btnPrimary} onClick={cargarFichasMedicas}>
                Consultar Fichas Médicas (Vet/Admin)
              </button>
            )}
          </div>
          <div style={styles.console}>{mensajeStatus}</div>
        </div>

        {fichas && (
          <div style={styles.card}>
            <h3>📋 Ficha Médica de Registro</h3>
            <pre style={styles.jsonBox}>{JSON.stringify(fichas, null, 2)}</pre>
          </div>
        )}

        <div style={styles.card}>
          <h3>📦 Productos e Insumos</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Stock</th>
                {isAdmin && <th style={styles.th}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id} style={styles.tr}>
                  <td style={styles.td}>{prod.nombre}</td>
                  <td style={styles.td}>${prod.precio}</td>
                  <td style={styles.td}>{prod.stock}</td>
                  {isAdmin && (
                    <td style={styles.td}>
                      <button style={styles.btnDangerSm} onClick={() => eliminarProducto(prod.id)}>
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {isVet && (
            <form onSubmit={crearProducto} style={styles.formInline}>
              <h4>Agregar producto</h4>
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                style={styles.input}
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={nuevoProducto.precio || ''}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: Number(e.target.value) })}
                style={styles.input}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={nuevoProducto.stock || ''}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: Number(e.target.value) })}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.btnSuccess}>Crear</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { backgroundColor: '#121214', color: '#e1e1e6', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' },
  content: { maxWidth: '900px', margin: '0 auto' },
  card: { backgroundColor: '#202024', borderRadius: '8px', padding: '20px', marginBottom: '20px', border: '1px solid #323238' },
  badge: { backgroundColor: '#61dafb', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginRight: '5px' },
  console: { backgroundColor: '#121214', padding: '12px', borderRadius: '6px', color: '#00ff66', border: '1px solid #323238', marginTop: '10px', fontFamily: 'monospace' },
  btnPrimary: { backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnSuccess: { backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnDanger: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnDangerSm: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
  th: { borderBottom: '2px solid #323238', textAlign: 'left', padding: '10px', color: '#a8a8b3' },
  td: { borderBottom: '1px solid #323238', padding: '10px' },
  tr: { borderBottom: '1px solid #323238' },
  formInline: { display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap' },
  input: { backgroundColor: '#121214', border: '1px solid #323238', color: '#fff', padding: '8px 12px', borderRadius: '6px' },
  jsonBox: { backgroundColor: '#121214', padding: '10px', borderRadius: '6px', color: '#38edf8' }
};