// src/services/api.ts

const AWS_API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

/**
 * Obtiene el token JWT activo buscando en las claves habituales donde 
 * Cognito o la app suelen almacenar la sesión del usuario.
 */
const getAuthToken = (): string | null => {
  return (
    localStorage.getItem('jwt_token') ||
    localStorage.getItem('idToken') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token')
  );
};

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No hay una sesión activa. Por favor, vuelve a iniciar sesión.');
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
    if (response.status === 401) {
      throw new Error('Sesión expirada o no autorizada (401). Por favor, vuelve a iniciar sesión.');
    }
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return await response.json();
};