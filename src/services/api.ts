// src/services/api.ts

const AWS_API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  const token = localStorage.getItem('jwt_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

  const response = await fetch(AWS_API_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Este es el encabezado que exige la evaluación
      'Authorization': `Bearer ${token}`,
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