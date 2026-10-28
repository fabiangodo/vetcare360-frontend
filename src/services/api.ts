// src/services/api.ts

const AWS_API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

/**
 * Busca de forma dinámica cualquier JWT válido generado por Cognito o la app
 * dentro de localStorage, inspeccionando todas las claves existentes.
 */
const getCognitoToken = (): string | null => {
  // 1. Buscar en todas las claves creadas por Amplify / Cognito
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    const lowerKey = key.toLowerCase();
    // Cognito guarda las claves con formato: CognitoIdentityServiceProvider.<clientId>.<username>.idToken
    if (lowerKey.includes('idtoken') || lowerKey.includes('accesstoken')) {
      const value = localStorage.getItem(key);
      if (value && value.startsWith('ey')) { // Los JWT siempre empiezan con 'ey'
        return value;
      }
    }
  }

  // 2. Búsqueda por nombres de clave estándar
  const standardKeys = ['idToken', 'accessToken', 'jwt_token', 'token', 'jwt'];
  for (const key of standardKeys) {
    const value = localStorage.getItem(key);
    if (value && value !== 'null' && value !== 'undefined') {
      return value;
    }
  }

  return null;
};

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  const token = getCognitoToken();

  console.log('Token obtenido para API Gateway:', token ? `${token.substring(0, 20)}...` : 'NULL/VACIO');

  if (!token) {
    throw new Error('No se encontró un token JWT activo en la sesión. Por favor, vuelve a iniciar sesión.');
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
      throw new Error('Error 401: Token expirado o rechazado por Cognito.');
    }
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return await response.json();
};