# 💻 VetCare 360 - Single Page Application Frontend (React + TypeScript)

## 📌 Contexto General del Proyecto
**VetCare 360** es el cliente web que permite la interacción de distintos tipos de usuarios (`Veterinario` y `Cliente`). Proporciona una interfaz intuitiva con autenticación centralizada gestionada por **AWS Cognito** y consumo de servicios REST protegidos.

---

## 🛠️ Tecnologías Utilizadas
* **Framework & Tooling:** React + TypeScript + Vite
* **Autenticación OIDC:** `react-oidc-context` (OAuth 2.0 / OpenID Connect)
* **Hosting / Despliegue Local:** Node.js (Vite Dev Server en puerto `5173`)
* **Integración:** Fetch API para peticiones HTTP autenticadas

---

## 🔍 Lo que hicimos en el Frontend (Paso a Paso)

### 1. Configuración del Proveedor OIDC (`main.tsx`)
* Configuramos el `AuthProvider` conectándolo directamente al **User Pool de AWS Cognito**.
* Definimos los parámetros de conexión OIDC (`authority`, `client_id`, `redirect_uri` y `response_type: "code"`).
* Configuramos el parámetro `post_logout_redirect_uri` para soportar la redirección tras el cierre de sesión.

### 2. Gestión de Sesión y Dashboard (`App.tsx`)
* **Redirección Hosted UI:** Si el usuario no está autenticado, la SPA lo redirige a la interfaz hosted de Cognito.
* **Extracción de Roles:** Al autenticarse, leemos el perfil del usuario (`auth.user?.profile`) y extraemos dinámicamente el grupo asignado (`cognito:groups`).
* **Inyección de Tokens:** Implementamos una función de consulta que incluye de forma transparente el `id_token` en el encabezado `Authorization: Bearer <TOKEN>`.
* **Cierre de Sesión Federado:** Programamos una función de logout que no solo destruye los tokens almacenados en el cliente mediante `auth.removeUser()`, sino que redirige al usuario al endpoint `/logout` de Cognito para eliminar la cookie de sesión del navegador.

---

## 🔗 Conexión con el Backend y AWS
1. **Variables de Entorno (`.env`):** Apuntamos las solicitudes hacia la URL base de AWS API Gateway (`https://oepttvmqv2.execute-api.us-east-1.amazonaws.com`).
2. **Flujo Integrado Completo:** 
   `React App` $\rightarrow$ `Cognito (Obtener Token)` $\rightarrow$ `Petición Fetch con Token` $\rightarrow$ `AWS API Gateway` $\rightarrow$ `Spring Boot Backend (EC2)` $\rightarrow$ `Respuesta / Error 403`.

---

## 🧪 Pruebas de Interfaz y Seguridad
* **Autenticación Cliente:** Login con `cliente.prueba@duocuc.cl` muestra el rol "Cliente", permitiendo ver productos y mostrando la alerta `403 Forbidden` al presionar "Ver Fichas Médicas".
* **Autenticación Veterinario:** Login con `vet.prueba@duocuc.cl` muestra el rol "Veterinario" y permite cargar exitosamente la respuesta de `/api/veterinario/fichas`.
* **Logout Exitoso:** Al hacer clic en "Cerrar Sesión", la app invalida la sesión local y la de Cognito, permitiendo cambiar de cuenta inmediatamente.
