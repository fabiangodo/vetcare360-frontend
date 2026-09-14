import { useAuth } from 'react-oidc-context';
import { useState } from 'react';

export default function App() {
  const auth = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const consultarApi = async (endpoint: string) => {
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.user?.id_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      const resData = await response.json();
      setData(resData);
    } catch (err: any) {
      setError(err.message);
    }
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
          <button onClick={() => consultarApi('/health')}>Probar /health (Local)</button>
          <button onClick={() => consultarApi('/api/productos')}>Ver Insumos/Productos</button>
        </div>

        <button onClick={() => auth.removeUser()}>Cerrar Sesión</button>

        {error && <p style={{ color: 'red', marginTop: '20px' }}><strong>Error:</strong> {error}</p>}
        {data && (
            <pre style={{ background: '#1e1e1e', color: '#00ff88', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
        )}
      </div>
  );
}