# Vehicle Management API & Web App

Sistema Full-Stack para gestión de vehículos y subastas. Permite administrar el catálogo de vehículos y las ventas asociadas mediante una arquitectura cliente-servidor, con autenticación OAuth2 utilizando Keycloak.

El proyecto está dividido en dos partes principales:

- **Backend (`/Back`)**: API RESTful robusta construida con Spring Boot.
- **Frontend (`/Front`)**: Interfaz de usuario dinámica construida con React y TypeScript.

---

## 🖥️ Frontend (React + TypeScript)

El lado del cliente es una Single Page Application (SPA) encargada de la interfaz y experiencia de usuario.

### Tecnologías Frontend

- **React 19** & **TypeScript**: Construcción de componentes tipados y escalables.
- **Vite**: Entorno de desarrollo rápido y empaquetador.
- **Tailwind CSS**: Estilos utilitarios para un diseño rápido y responsivo.
- **React Router DOM**: Gestión de rutas y navegación en la aplicación.
- **Keycloak JS**: Integración directa con el servidor de autenticación para Single Sign-On (SSO).
- **Lucide React**: Biblioteca de iconos.
- **Vitest & React Testing Library**: Entorno para pruebas unitarias.

### Ejecución del Frontend

1. Navegar a la carpeta del frontend:
   ```bash
   cd Front
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo (por defecto en `http://localhost:5173` o el que Vite asigne):
   ```bash
   npm run dev
   ```

---

## ⚙️ Backend (Spring Boot)

API REST encargada de la lógica de negocio, acceso a datos y protección de recursos.

### Tecnologías Backend

- **Java 17** & **Spring Boot 3.2**
- **Spring Security**: Configurado como Resource Server de OAuth2 validando tokens JWT.
- **Spring Data JPA** & **PostgreSQL**: Persistencia de datos.
- **MapStruct**: Mapeo eficiente entre Entidades y DTOs.
- **SpringDoc OpenAPI (Swagger)**: Documentación de la API.
- **Lombok**: Reducción de código repetitivo (getters, setters, constructores).

### Requisitos previos

- JDK 17
- Maven 3.6+
- **Keycloak** (puerto 8080) con un realm configurado llamado `vehicle-auction` y roles `USER` y `ADMIN`.

### Configuración del Backend

La aplicación corre por defecto en el puerto `8081`.

Variables relevantes en `Back/src/main/resources/application.properties`:

- `server.port`: Puerto de la API (8081)
- `spring.security.oauth2.resourceserver.jwt.issuer-uri`: URI del realm de Keycloak (ej. `http://localhost:8080/realms/vehicle-auction`)

### Ejecución del Backend

Navegar a la carpeta del backend y ejecutar:

```bash
cd Back
mvn spring-boot:run
```

O compilando primero:

```bash
mvn clean install
java -jar target/vehicle-auction-api-0.0.1-SNAPSHOT.jar
```

### Endpoints principales

| Método | Ruta                  | Descripción              | Roles Requeridos |
| ------ | --------------------- | ------------------------ | ---------------- |
| POST   | `/api/vehicles`       | Crear vehículo           | USER, ADMIN      |
| GET    | `/api/vehicles/{vin}` | Obtener vehículo por VIN | USER, ADMIN      |
| GET    | `/api/vehicles/list`  | Listar vehículos         | USER, ADMIN      |
| PUT    | `/api/vehicles/{vin}` | Actualizar vehículo      | USER, ADMIN      |
| DELETE | `/api/vehicles/{vin}` | Eliminar vehículo        | USER, ADMIN      |
| POST   | `/api/sales`          | Crear venta              | ADMIN            |
| GET    | `/api/sales/{id}`     | Obtener venta por ID     | ADMIN            |
| GET    | `/api/sales`          | Listar ventas            | ADMIN            |
| PUT    | `/api/sales/{id}`     | Actualizar venta         | ADMIN            |
| DELETE | `/api/sales/{id}`     | Eliminar venta           | ADMIN            |

_(Todas las operaciones requieren un token Bearer JWT excepto las rutas públicas indicadas abajo)._

### Rutas públicas (Backend)

- `GET /actuator/health` - Health check
- `GET /v3/api-docs/**` - Documentación OpenAPI
- `GET /swagger-ui/**` - Interfaz Swagger UI interactiva (`http://localhost:8081/swagger-ui.html`)

---

## 🔐 Autenticación y CORS

### Keycloak (SSO)

Toda la aplicación confía en un servidor **Keycloak** local. El frontend inicia un flujo de login automáticamente (`check-sso`) y adjunta el token JWT a las peticiones hacia la API en el backend, el cual valida las firmas criptográficas y extrae los roles (`USER`, `ADMIN`).

### CORS (Cross-Origin Resource Sharing)

El backend está configurado para aceptar peticiones de los orígenes del frontend (`http://localhost:3000`, `http://localhost:4200` y Vite local). Esto puede ser ajustado en el archivo `SecurityConfig.java` del backend.
