
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

export async function apiRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {

  if (!API_URL) {
    throw new Error('VITE_API_URL no está configurada');
  }

  if (!token) {
    throw new Error('No existe una sesión autenticada');
  }

  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return await response.json() as T;
}

export interface ProductoAPI {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export type ProductoRequest = Omit<ProductoAPI, 'id'>;

// Consultar productos
export const obtenerProductos = (token: string) =>
  apiRequest<ProductoAPI[]>('/api/productos', token);

// Crear producto
export const crearProducto = (
  producto: ProductoRequest,
  token: string
) =>
  apiRequest<ProductoAPI>('/api/productos', token, {
    method: 'POST',
    body: JSON.stringify(producto)
  });

// Actualizar producto
export const actualizarProducto = (
  id: number,
  producto: ProductoRequest,
  token: string
) =>
  apiRequest<ProductoAPI>(`/api/productos/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(producto)
  });

// Eliminar producto
export const eliminarProducto = (
  id: number,
  token: string
) =>
  apiRequest<void>(`/api/productos/${id}`, token, {
    method: 'DELETE'
  });

// Registrar mascota
export const registrarMascotaEnAWS = (
  datosMascota: object,
  token: string
) =>
  apiRequest('/api/mascotas', token, {
    method: 'POST',
    body: JSON.stringify({
      ...datosMascota,
      timestamp: new Date().toISOString(),
      origen: 'FRONTEND_REACT'
    })
  });
