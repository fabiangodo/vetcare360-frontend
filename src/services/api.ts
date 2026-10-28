// src/services/api.ts

const AWS_API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  // Buscar en todas las ubicaciones donde AWS Amplify / Cognito guardan los tokens
  let token = null;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('idToken') || key.includes('accessToken') || key.includes('jwt'))) {
      token = localStorage.getItem(key);
      if (token) break;
    }
  }

  // Fallback si la clave se guardó directamente como token/jwt_token
  if (!token) {
    token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
  }

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