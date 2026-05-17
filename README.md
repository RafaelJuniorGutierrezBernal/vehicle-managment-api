# Vehicle Management API

![Java CI](https://github.com/RafaelJuniorGutierrezBernal/vehicle-managment-api/actions/workflows/ci.yml/badge.svg)

REST API for vehicle and sales management built with Java 17 and Spring Boot. This project was designed to simulate a real-world backend system where authenticated users interact with protected business resources through a secure, layered architecture.

## Overview

Vehicle Management API is a backend application focused on managing vehicles and their related sales operations. Beyond simple CRUD endpoints, the system includes authentication with Keycloak, JWT-based authorization, role-based access control, persistence with PostgreSQL, DTO mapping, API documentation, testing, and continuous integration.

The goal of this project is not only to expose endpoints, but to demonstrate how a complete backend flow works from client request to secured business logic and database persistence.

## Business Scenario

This system represents a vehicle management platform where authorized users can interact with operational data depending on their permissions.

### Main actors

- **USER**: can access general vehicle operations
- **ADMIN**: can manage vehicles and sales with elevated permissions
- **System**: validates access, processes business logic, and persists data securely

## Features

- Vehicle CRUD operations
- Sales registration and management
- Authentication and authorization with OAuth2, JWT, and Keycloak
- Role-based access control for protected endpoints
- Layered architecture with Controller, Service, Repository, and Entity separation
- DTO mapping with MapStruct
- PostgreSQL persistence with Spring Data JPA
- Interactive API documentation with Swagger UI / OpenAPI
- Unit testing with JUnit and Mockito
- Continuous Integration with GitHub Actions

## End-to-End System Flow

The project is easier to understand when viewed as a complete request flow instead of isolated backend components.

```text
[ Client / Frontend / API Consumer ]
                |
                | 1. Authenticate user credentials
                v
           [ Keycloak ]
                |
                | 2. Return JWT access token
                v
[ Client sends request with Bearer Token ]
                |
                v
         [ Spring Security Filter ]
                |
                | 3. Validate token and roles
                v
            [ Controller ]
                |
                | 4. Receive and validate request
                v
             [ Service ]
                |
                | 5. Apply business rules
                v
           [ Repository ]
                |
                | 6. Persist / query data
                v
          [ PostgreSQL DB ]
                |
                | 7. Return result
                v
             [ Response ]
```

## Authentication Flow

This project uses Keycloak as the identity and access management provider.

### Authentication sequence

1. The user authenticates against Keycloak.
2. Keycloak returns a JWT access token.
3. The client sends the token in the `Authorization: Bearer <token>` header.
4. Spring Security validates the token and extracts roles/authorities.
5. The application authorizes or rejects the request based on endpoint permissions.
6. If authorized, the request continues through the application layers.

### Auth flow diagram

```text
User -> Keycloak -> JWT Token
User -> API with Bearer Token
API -> Validate Token -> Check Roles -> Allow / Deny
```

## Role-Based Access

The API applies role-based access control to restrict sensitive operations.

| Role | Permissions |
|------|-------------|
| USER | Access general vehicle-related operations |
| ADMIN | Full access to vehicle and sales management endpoints |

This separation helps simulate a real production scenario where not every authenticated user should have the same privileges.

## Architecture

The application follows a layered architecture to keep responsibilities clearly separated and improve maintainability.

```text
Client
  |
  v
Controller -> Service -> Repository -> Database
                |
                v
              DTO / Mapper
```

### Layer responsibilities

- **Controller:** receives HTTP requests, delegates work, and returns responses
- **Service:** contains business logic and application rules
- **Repository:** handles persistence with Spring Data JPA
- **Entity:** represents persisted domain models
- **DTO / Mapper:** decouples internal entities from external API contracts

## Project Structure

```text
src/
 ├── main/
 │   ├── java/
 │   │   └── ...
 │   └── resources/
 └── test/
     └── java/
```

## Core Use Cases

### 1. User authenticates and retrieves vehicles

1. A user authenticates through Keycloak.
2. Keycloak returns a valid JWT token.
3. The client sends a request to retrieve vehicles.
4. Spring Security validates the token.
5. The controller receives the request.
6. The service processes the request logic.
7. The repository retrieves the data from PostgreSQL.
8. The API returns the vehicle list.

### 2. Admin creates a new vehicle

1. An admin authenticates and receives a JWT token.
2. The admin sends a `POST /api/vehicles` request.
3. Spring Security validates the token and role.
4. The controller validates the incoming payload.
5. The service applies business rules.
6. The repository saves the new vehicle in PostgreSQL.
7. The API returns the created resource.

### 3. Admin registers a sale

1. An admin logs in through Keycloak.
2. The admin sends a request to the sales endpoint.
3. The system validates authorization.
4. The business layer processes the sale registration.
5. The repository stores the sale.
6. The API responds with the sale data or confirmation.

## Tech Stack

- Java 17
- Spring Boot
- Spring Security
- OAuth2 Resource Server
- JWT
- Keycloak
- Spring Data JPA
- Hibernate
- PostgreSQL
- MapStruct
- Lombok
- Maven
- Docker Compose
- Swagger / OpenAPI
- JUnit 5
- Mockito
- GitHub Actions

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RafaelJuniorGutierrezBernal/vehicle-managment-api.git
cd vehicle-managment-api
```

### 2. Configure environment variables

The project currently uses the `application.properties` file in `Back/src/main/resources/`. You can update the values there to match your local PostgreSQL and Keycloak setup.

### 3. Start infrastructure services

Ensure your PostgreSQL and Keycloak instances are running.

### 4. Run the application

```bash
cd Back
mvn spring-boot:run
```

## Environment Variables

Use the following reference based on the current `application.properties`:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/vehicle-managment-db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=salome32

KEYCLOAK_SERVER_URL=http://localhost:8080
KEYCLOAK_REALM=vehicle-management
KEYCLOAK_CLIENT_ID=vehicle-api
KEYCLOAK_CLIENT_SECRET=your_client_secret

JWT_ISSUER_URI=http://localhost:8080/realms/vehicle-management
SERVER_PORT=8081
```

## API Documentation

Once the application is running, Swagger UI should be available at one of these endpoints:

```text
http://localhost:8081/swagger-ui.html
http://localhost:8081/swagger-ui/index.html
```

## Example Requests

### Get all vehicles

```bash
curl -X GET http://localhost:8081/api/vehicles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create a vehicle

```bash
curl -X POST http://localhost:8081/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2022
  }'
```

### Register a sale

```bash
curl -X POST http://localhost:8081/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "vehicleId": 1,
    "customerName": "John Doe",
    "saleAmount": 25000
  }'
```

## Running Tests

```bash
cd Back
mvn test
```

## Continuous Integration

This project includes a GitHub Actions workflow that automatically runs the test suite on push and pull request events.

## What This Project Demonstrates

This repository showcases practical backend engineering skills in:

- Secure API design
- Authentication and authorization flows
- Role-based access control
- Layered architecture and maintainable code organization
- Relational persistence with PostgreSQL
- DTO mapping and API contract separation
- Automated testing with JUnit and Mockito
- CI workflow integration with GitHub Actions
- Technical documentation focused on both architecture and business flow

## Future Improvements

- Add integration tests for complete request flows
- Improve Docker setup for a one-command local environment
- Add pagination and filtering for listing endpoints
- Expand the domain with customers and inventory modules
- Include sequence diagrams or Mermaid diagrams in future documentation versions

## Author

**Rafael Junior Gutiérrez Bernal**

- GitHub: [RafaelJuniorGutierrezBernal](https://github.com/RafaelJuniorGutierrezBernal)
- LinkedIn: [rafaeljunior](https://www.linkedin.com/in/rafael-junior-gutierrez-bernal-03740a2b4/)
