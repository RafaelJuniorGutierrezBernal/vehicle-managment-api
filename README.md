# Vehicle Management API

API REST para gestión de vehículos, Permite administrar el catálogo de vehículos y las ventas asociadas mediante autenticación OAuth2 con Keycloak.

## Tecnologías

- Java 17
- Spring Boot 3.2
- Spring Security (OAuth2 Resource Server, JWT)
- Spring Data JPA
- PostgreSQL
- MapStruct
- SpringDoc OpenAPI (Swagger)
- Lombok
- Postman

## Requisitos previos

- JDK 17
- Maven 3.6+
- Keycloak (puerto 8080) con un realm configurado llamado `vehicle-auction` y roles `USER` y `ADMIN`

## Configuración

La aplicación corre por defecto en el puerto 8081.

Variables relevantes en `application.properties`:

- `server.port`: Puerto de la API (8081)
- `spring.security.oauth2.resourceserver.jwt.issuer-uri`: URI del realm de Keycloak

## Ejecución

```bash
mvn spring-boot:run
```

O compilando primero:

```bash
mvn clean install
java -jar target/vehicle-auction-api-0.0.1-SNAPSHOT.jar
```

## Endpoints principales

| Método | Ruta                | Descripción              | Roles       |
| ------ | ------------------- | ------------------------ | ----------- |
| POST   | /api/vehicles       | Crear vehículo           | USER, ADMIN |
| GET    | /api/vehicles/{vin} | Obtener vehículo por VIN | USER, ADMIN |
| GET    | /api/vehicles/list  | Listar vehículos         | USER, ADMIN |
| PUT    | /api/vehicles/{vin} | Actualizar vehículo      | USER, ADMIN |
| DELETE | /api/vehicles/{vin} | Eliminar vehículo        | USER, ADMIN |
| POST   | /api/sales          | Crear venta              | ADMIN       |
| GET    | /api/sales/{id}     | Obtener venta por ID     | ADMIN       |
| GET    | /api/sales          | Listar ventas            | ADMIN       |
| PUT    | /api/sales/{id}     | Actualizar venta         | ADMIN       |
| DELETE | /api/sales/{id}     | Eliminar venta           | ADMIN       |

Todas las operaciones requieren Bearer token JWT excepto las rutas públicas indicadas abajo.

## Rutas públicas

- `GET /actuator/health` - Health check
- `GET /v3/api-docs/**` - Documentación OpenAPI
- `GET /swagger-ui/**` - Interfaz Swagger UI

## Documentación

Una vez iniciada la aplicación, la documentación interactiva está disponible en:

http://localhost:8081/swagger-ui.html

## CORS

Por defecto se permiten orígenes `http://localhost:3000` y `http://localhost:4200`. Se puede ajustar en `SecurityConfig`.
