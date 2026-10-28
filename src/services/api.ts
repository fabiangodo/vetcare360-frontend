// src/services/api.ts

// Asegúrate de que la URL coincida con la estructura de tu API Gateway
const AWS_API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  // 1. Obtener token con fallback de prueba
  const token = 
    localStorage.getItem('jwt_token') || 
    localStorage.getItem('idToken') || 
    localStorage.getItem('accessToken') || 
    localStorage.getItem('token') ||
    ''; // Evita el throw inmediato para ver el comportamiento en Network

  console.log('Token obtenido para la petición:', token ? 'SI (Existe token)' : 'NO (Vacío)');

  const response = await fetch(AWS_API_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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