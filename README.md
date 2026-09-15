# 💻 VetCare 360 - Single Page Application Frontend (React + TypeScript)

## 📌 Contexto General del Proyecto
**VetCare 360** es el cliente web que permite la interacción de distintos tipos de usuarios (`Admin`, `Veterinario` y `Cliente`). Proporciona una interfaz intuitiva con autenticación centralizada gestionada por **AWS Cognito**, consumo de servicios REST protegidos en Spring Boot y persistencia en tiempo real sobre PostgreSQL (Supabase).

---

## 🛠️ Tecnologías Utilizadas
* **Framework & Tooling:** React + TypeScript + Vite
* **Autenticación OIDC:** `react-oidc-context` (OAuth 2.0 / OpenID Connect)
* **Hosting / Despliegue Local:** Node.js (Vite Dev Server en puerto `5173`)
* **Integración:** Fetch API con inyección de tokens de acceso JWT

---

## 🔍 Lo que hicimos en el Frontend (Paso a Paso)

### 1. Configuración del Proveedor OIDC (`main.tsx`)
* Configuramos el `AuthProvider` conectándolo directamente al **User Pool de AWS Cognito** (`us-east-1_Gz8tIv6dd`).[cite: 10]
* Definimos los parámetros OIDC (`authority`, `client_id`, `redirect_uri` y `response_type: "code"`).
* Configuramos el parámetro `post_logout_redirect_uri` para soportar la redirección tras el cierre de sesión hacia Cognito Hosted UI.[cite: 10]

### 2. Gestión de Sesión y Dashboard (`App.tsx`)
* **Redirección Hosted UI:** Si el usuario no está autenticado, la SPA lo redirige a la interfaz hosted de Cognito.
* **Extracción de Roles:** Al autenticarse, leemos el perfil del usuario (`auth.user?.profile`) y extraemos dinámicamente los grupos asignados (`cognito:groups`) para determinar permisos de UI (`isAdmin`, `isVet`).[cite: 10]
* **Mapeo de Datos:** Implementamos lógica de mapeo entre el contrato JSON del backend (`name`, `description`, `price`, `stock`) y el estado interno del componente React (`nombre`, `descripcion`, `precio`, `stock`).[cite: 10]
* **Gestión de Productos (CRUD):**
  * **Listar (`GET /api/productos`):** Carga automática al autenticarse.[cite: 10]
  * **Crear (`POST /api/productos`):** Formulario dinámico habilitado para roles `Veterinario` y `Admin`.[cite: 10]
  * **Eliminar (`DELETE /api/productos/{id}`):** Acción de borrado directo reservada exclusivamente para el rol `Admin`.[cite: 10]
* **Cierre de Sesión Federado:** Destruye los tokens locales con `auth.removeUser()` e invalida la sesión central en Cognito (`/logout`).[cite: 10]

---

## 🔗 Conexión con el Backend y AWS
1. **Variables de Entorno y Base URL:** Apuntamos las solicitudes hacia la ruta con stage de AWS API Gateway:
   `https://oepttvmqv2.execute-api.us-east-1.amazonaws.com/prod`[cite: 10]
2. **Flujo Integrado Completo:** 
   `React App` $\rightarrow$ `Cognito (Obtener Access Token)` $\rightarrow$ `Fetch con Authorization: Bearer` $\rightarrow$ `AWS API Gateway (/prod/api/...)` $\rightarrow$ `Spring Boot Backend (EC2)` $\rightarrow$ `Supabase PostgreSQL`.[cite: 1, 7, 10]

---

## 🧪 Pruebas de Interfaz y Seguridad
* **Autenticación Cliente:** Login con `cliente.prueba@duocuc.cl` carga el catálogo pero muestra restricción de acceso en funciones médicas o de modificación.
* **Autenticación Veterinario:** Login con `vet.prueba@duocuc.cl` muestra los roles asignados, habilita la consulta de Fichas Médicas y el formulario para agregar productos a la base de datos.[cite: 10]
* **Autenticación Admin:** Habilita el control total, incluyendo el botón para eliminar registros de productos mediante peticiones `DELETE`.[cite: 10]
* **Persistencia:** Todos los productos creados o eliminados desde la interfaz impactan directamente en la tabla `products` de Supabase.[cite: 7, 10]