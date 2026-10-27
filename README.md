# 💻 VetCare 360 - Single Page Application Frontend (React + TypeScript)

## 📌 Contexto General del Proyecto
VetCare 360 es una solución web integral para la gestión de clínicas veterinarias. Permite la interacción diferenciada según el perfil del usuario (**Administrador**, **Veterinario** y **Cliente**). Ofrece una interfaz moderna, reactiva y persistencia de datos en tiempo real mediante integración directa con **Supabase (PostgreSQL)** y despliegue continuo en **Vercel**.

---

## 🛠️ Tecnologías Utilizadas
- **Framework & Tooling:** React 18 + TypeScript + Vite
- **Diseño & Estilos:** Tailwind CSS, Lucide React (Iconografía)
- **Base de Datos & Backend:** Supabase (`@supabase/supabase-js`) con API REST y JWT de acceso
- **Hosting / Despliegue Continuo:** Vercel (CI/CD sincronizado con GitHub)

---

## 🔍 Módulos e Integración de la Aplicación (Paso a Paso)

### 1. Control de Acceso Basado en Roles (RBAC) y Sesión
- **Vista Administrador (`editor`):** Acceso total para crear, editar y eliminar registros en todas las tablas, incluyendo la pestaña exclusiva de **Cuentas Registradas**.
- **Vista Veterinario (`veterinario`):** Gestión de mascotas, visualización de citas médicas y modificación/actualización de stock e inventario.
- **Vista Cliente (`cliente`):** Consulta del catálogo, uso del **Carrito de Compras** interactivo, descuento de stock y consulta de **Boletas Electrónicas**.

### 2. Módulos y Tablas Sincronizadas (CRUD en Supabase)
- **Mascotas (`public.mascotas`):** Registro, consulta de ficha y eliminación de animales inscritos (`nombre`, `especie`, `raza`, `edad`, `propietario`).
- **Citas Médicas (`public.citas`):** Consulta del cronograma de atenciones veterinarias (`mascota`, `propietario`, `fecha`, `hora`, `motivo`).
- **Productos e Inventario (`public.products`):** Control de catálogo (`name`, `description`, `price`, `stock`).
- **Carrito & Boletas (`public.boletas`):** Procesamiento de compras para clientes con cálculo de total, actualización dinámica de stock e inserción de la boleta electrónica con formato JSON.
- **Cuentas Registradas (`public.usuarios`):** Panel exclusivo de administración para la auditoría de accesos (`nombre`, `email`, `rol`).

### 3. Arquitectura Directa con Supabase
- Para garantizar un tiempo de respuesta óptimo y disponibilidad continua en la evaluación, la conexión se realiza directamente mediante `@supabase/supabase-js` utilizando credenciales JWT seguras (`anon key`).
- **Flujo Integrado:** React SPA (Vercel) ↔ API REST Directa ↔ Supabase PostgreSQL Cloud.

---

## 👥 Perfiles y Credenciales de Prueba

| Perfil | Correo Electrónico | Permisos |
| :--- | :--- | :--- |
| **Administrador** | `admin@test.com` | Control total (CRUD) + Menú exclusivo de Usuarios. |
| **Veterinario** | `editor@test.com` | Crear mascotas/productos y editar stock/precios. |
| **Cliente** | `viewer@test.com` | Navegación, uso de Carrito, pago de boletas y consulta de historial. |

---

## 🧪 Pruebas de Interfaz y Persistencia
- **Autenticación Cliente:** `viewer@test.com` agrega productos al carrito, procesa el pago, descuenta unidades de la tabla `products` y genera un registro persistente en `boletas`.
- **Autenticación Veterinario:** `editor@test.com` accede con el nombre `usuario_veterinario`, permite inscribir mascotas y modificar stock.
- **Autenticación Admin:** `admin@test.com` habilita la eliminación de registros y la auditoría de la tabla `usuarios`.
- **Persistencia en la Nube:** Todas las acciones modifican la base de datos en tiempo real y son auditables desde la pestaña *Network* de DevTools (respuestas HTTP `200`, `201` y `204`).

---

## 🌐 Producción
- **URL Desplegada en Vercel:** [vetcare360-frontend-b2ze.vercel.app](https://vetcare360-frontend-b2ze.vercel.app/)
