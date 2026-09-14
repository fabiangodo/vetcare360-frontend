import { useAuth } from 'react-oidc-context';
import { useState } from 'react';

export default function App() {
  const auth = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Asegurar la URL base limpia
  const rawBaseUrl = import.meta.env.VITE_API_URL || 'https://oepttvmqv2.execute-api.us-east-1.amazonaws.com';
  const apiBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  const consultarApi = async (endpoint: string, requiereAuth: boolean = true) => {
    setError(null);
    setData(null);

    // Formatear endpoint para evitar barras dobles //
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${apiBaseUrl}${cleanEndpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (requiereAuth && auth.user?.id_token) {
      headers['Authorization'] = `Bearer ${auth.user.id_token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (response.status === 403) {
        throw new Error("HTTP 403 Forbidden: No tienes el rol requerido para este endpoint.");
      }

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }

      const resData = await response.json();
      setData(resData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const cerrarSesion = () => {
    // 1. Destruir la sesión local en React
    auth.removeUser();

    // 2. Destruir la cookie de sesión en la Hosted UI de AWS Cognito
    const domain = `https://us-east-1gz8tiv6dd.auth.us-east-1.amazoncognito.com`;
    const clientId = import.meta.env.VITE_COGNITO_APP_CLIENT_ID;
    const logoutUri = encodeURIComponent("http://localhost:5173");

    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  };

  if (auth.isLoading) return <div style={{ padding: '2rem' }}>Cargando sesión...</div>;

  if (!auth.isAuthenticated) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>VetCare 360</h1>
        <p>Inicia sesión para acceder a la gestión veterinaria.</p>
        <button onClick={() => auth.signinRedirect()}>Iniciar Sesión (Cognito)</button>
      </div>
    );
  }

  const roles = (auth.user?.profile["cognito:groups"] as string[]) || [];

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>VetCare 360 - Dashboard</h1>
      <p>Usuario: <strong>{auth.user?.profile.email}</strong></p>
      <p>Rol: <strong>{roles.join(', ') || 'Sin Rol Asignado'}</strong></p>

      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button onClick={() => consultarApi('/health', false)}>Probar /health</button>
        <button onClick={() => consultarApi('/api/productos')}>Ver Insumos/Productos</button>
        <button onClick={() => consultarApi('/api/veterinario/fichas')}>Ver Fichas Médicas</button>
      </div>

      <button onClick={cerrarSesion}>Cerrar Sesión</button>

      {error && <p style={{ color: 'red', marginTop: '20px' }}><strong>Error:</strong> {error}</p>}
      {data && (
        <pre style={{ background: '#1e1e1e', color: '#00ff88', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}