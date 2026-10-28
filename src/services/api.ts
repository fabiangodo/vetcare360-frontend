// src/services/api.ts

const AWS_API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  // 1. Buscar prioritariamente el idToken de la sesión Cognito
  let token: string | null = null;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('idToken')) {
      token = localStorage.getItem(key);
      if (token) break;
    }
  }

  // 2. Fallback a otras claves de sesión si no encuentra idToken directo
  if (!token) {
    token = 
      localStorage.getItem('idToken') || 
      localStorage.getItem('jwt_token') || 
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken');
  }

  console.log('Token enviado al backend:', token ? 'Token cargado' : 'Sin token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(AWS_API_GATEWAY_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      ...datosMascota,
      timestamp: new Date().toISOString(),
      origen: 'FRONTEND_REACT'
    }),
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return await response.json();
};