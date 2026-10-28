# 💻 VetCare 360 - Single Page Application Frontend (React + TypeScript)

## 📌 Contexto General del Proyecto

VetCare 360 es una solución web integral para la gestión de clínicas veterinarias. Permite la interacción diferenciada según el perfil del usuario (Administrador, Veterinario y Cliente). Ofrece una interfaz moderna y reactiva, combinando persistencia directa en la nube y un flujo de backend desacoplado bajo una arquitectura Serverless.

---

## 🛠️ Tecnologías Utilizadas

- **Framework & Tooling:** React 18 + TypeScript + Vite
- **Diseño & Estilos:** Tailwind CSS, Lucide React (Iconografía)
- **Autenticación & Seguridad:** AWS Cognito (`us-east-1`)
- **Backend & Integración Serverless:** AWS API Gateway + AWS Lambda (Node.js)
- **Base de Datos & Persistencia:** Supabase (PostgreSQL) con API REST y JWT de acceso
- **Hosting / Despliegue Continuo:** Vercel (CI/CD sincronizado con GitHub)

---

## ☁️ Arquitectura Serverless y Flujo de Datos

El sistema implementa un patrón desacoplado para el procesamiento seguro de acciones y órdenes en la plataforma.

```text
[ Cliente Web (React / Vercel) ]
             │
             │ 1. Evento de usuario (Botón / Orden) + JWT (AWS Cognito)
             ▼
[ AWS API Gateway + Cognito Authorizer ]
             │
             │ 2. Validación de Token e Invocación de Evento
             ▼
      [ AWS Lambda ]
             │
             │ 3. Procesamiento de Lógica & Inserción REST
             ▼
   [ Supabase (PostgreSQL) ]

### 🔄 Flujo de Transmisión de Datos Paso a Paso:

1. **Acción del Usuario y Autenticación:**  
   Al interactuar con la interfaz (por ejemplo, al hacer clic en un botón para enviar una solicitud, registrar información o procesar una orden), la aplicación empaqueta los datos y adjunta el `IdToken` (JWT) emitido por **AWS Cognito** en la cabecera `Authorization: Bearer <TOKEN>`.

2. **Recepción y Validación en AWS API Gateway:**  
   La petición HTTP se envía hacia el endpoint expuesto en **AWS API Gateway**. El **Cognito Authorizer** valida la firma y vigencia del token. Si la solicitud es autorizada, el API Gateway delega el evento e invoca automáticamente la función **AWS Lambda**.

3. **Procesamiento en AWS Lambda:**  
   La función **AWS Lambda** procesa el *payload* recibido, ejecuta la lógica de negocio requerida y se conecta de forma segura con la API REST de **Supabase** utilizando credenciales protegidas en sus variables de entorno.

4. **Persistencia y Respuesta:**  
   La Lambda realiza la escritura/actualización en la base de datos PostgreSQL, genera los registros de auditoría/informes correspondientes y retorna una respuesta `200 OK` (con cabeceras CORS). El frontend recibe la confirmación y actualiza la interfaz de usuario en tiempo real.

---

## 🔍 Módulos e Integración de la Aplicación

### 1. Control de Acceso Basado en Roles (RBAC) y Sesión

- **Vista Administrador (`admin@test.com`):** Acceso total para crear, editar y eliminar registros en todas las tablas, incluyendo la pestaña exclusiva de *Cuentas Registradas*.
- **Vista Veterinario (`editor@test.com`):** Gestión de mascotas, visualización de citas médicas y modificación/actualización de stock e inventario.
- **Vista Cliente (`viewer@test.com`):** Consulta del catálogo, uso del Carrito de Compras interactivo, descuento de stock y consulta de Boletas Electrónicas.

### 2. Módulos y Tablas Sincronizadas

- **Mascotas (`public.mascotas`):** Registro y consulta de ficha clínica de animales inscritos.
- **Citas Médicas (`public.citas`):** Cronograma y agenda de atenciones veterinarias.
- **Productos e Inventario (`public.products`):** Control de catálogo, stock y precios.
- **Carrito & Boletas (`public.boletas`):** Procesamiento de órdenes de compra con cálculo de total, actualización dinámica de inventario e inserción de boletas en formato JSON.
- **Cuentas Registradas (`public.usuarios`):** Panel exclusivo de administración para la auditoría de accesos.

---

## 👥 Perfiles y Credenciales de Prueba

| Perfil | Correo Electrónico | Permisos |
| :--- | :--- | :--- |
| **Administrador** | `admin@test.com` | Control total (CRUD) + Menú exclusivo de Usuarios. |
| **Veterinario** | `editor@test.com` | Crear mascotas/productos y editar stock/precios. |
| **Cliente** | `viewer@test.com` | Navegación, uso de Carrito, pago de boletas y consulta de historial. |

---

## 🧪 Pruebas de Interfaz y Persistencia

- **Autenticación Cliente:** `viewer@test.com` agrega productos al carrito, procesa la orden de pago, descuenta unidades de la tabla `products` y genera un registro persistente en `boletas`.
- **Autenticación Veterinario:** `editor@test.com` accede como `usuario_veterinario`, permitiendo registrar nuevas fichas y modificar el inventario.
- **Autenticación Admin:** `admin@test.com` habilita la eliminación de registros y la auditoría de la tabla `usuarios`.
- **Persistencia en la Nube:** Las solicitudes canalizadas a través del API Gateway y Lambda garantizan integridad de datos, reflejándose en tiempo real en Supabase con respuestas HTTP 200, 201 y 204.

---

## 🌐 Producción

- **URL Desplegada en Vercel:** [vetcare360-frontend-b2ze.vercel.app](https://vetcare360-frontend-b2ze.vercel.app)
