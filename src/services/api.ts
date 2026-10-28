// src/services/api.ts

const AWS_API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  // Buscar en localStorage las claves típicas de Cognito / Amplify
  let token = null;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('idToken') || key.includes('accessToken'))) {
      token = localStorage.getItem(key);
      if (token) break;
    }
  }

  if (!token) {
    token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
  }

  console.log('--- JWT TOKEN ENVIADO ---');
  console.log(token);

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