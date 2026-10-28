// src/services/api.ts

const AWS_API_GATEWAY_URL = 'https://02aepkj5g9.execute-api.us-east-1.amazonaws.com/api/mascotas';

/**
 * Obtiene el JWT leyendo el objeto 'vetcare_user' guardado en localStorage.
 */
const getAuthToken = (): string | null => {
  try {
    const userDataStr = localStorage.getItem('vetcare_user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      // Extrae el token del objeto (revisa idToken, accessToken, token o jwt)
      return userData.idToken || userData.accessToken || userData.token || userData.jwt || null;
    }
  } catch (e) {
    console.error('Error al parsear vetcare_user de localStorage', e);
  }
  return null;
};

export const registrarMascotaEnAWS = async (datosMascota: object) => {
  const token = getAuthToken();

  console.log('Token recuperado de vetcare_user:', token ? `${token.substring(0, 15)}...` : 'NO ENCONTRADO');

  if (!token) {
    throw new Error('No se encontró un token válido en vetcare_user. Inicia sesión de nuevo.');
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