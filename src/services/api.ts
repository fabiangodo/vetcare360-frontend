// src/services/api.ts

const AWS_API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  // Buscar idToken o cualquier token JWT en localStorage
  let token = localStorage.getItem('idToken') || localStorage.getItem('jwt_token') || localStorage.getItem('token');

  // Fallback si no existe en clave individual pero sí dentro de vetcare_user
  if (!token) {
    try {
      const userData = JSON.parse(localStorage.getItem('vetcare_user') || '{}');
      token = userData.idToken || userData.accessToken || null;
    } catch {
      token = null;
    }
  }

  console.log('Token cargado para envío:', token ? `${token.substring(0, 15)}...` : 'NO ENCONTRADO');

  if (!token) {
    throw new Error('No se encontró un token válido. Por favor, cierra e inicia sesión de nuevo.');
  }

  const response = await fetch(AWS_API_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
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