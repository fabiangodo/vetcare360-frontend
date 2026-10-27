// src/services/api.ts

// Reemplaza con tu URL real concatenada con la ruta
const API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  // 1. Obtener el token de autorización JWT (si existe)
  const token = localStorage.getItem('jwt_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_token';

  // 2. Petición POST real al API Gateway
  const response = await fetch(API_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Encabezado de autorización exigido por el API Gateway
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...datosMascota,
      timestamp: new Date().toISOString(),
      origen: 'FRONTEND_REACT_VETCARE'
    }),
  });

  if (!response.ok) {
    throw new Error(`Error en API Gateway: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};