# Vehicle Management API

![Java CI](https://github.com/RafaelJuniorGutierrezBernal/vehicle-managment-api/actions/workflows/ci.yml/badge.svg)

REST API for vehicle and sales management built with Java 17 and Spring Boot. The project includes authentication and authorization with OAuth2, JWT, and Keycloak, follows a layered architecture, and exposes interactive API documentation with Swagger/OpenAPI.

## Overview

This project was built to simulate a real backend system for managing vehicles and related sales operations. It focuses on clean architecture, security, maintainability, and API documentation, making it a strong showcase of backend development skills.

## Features

- Vehicle CRUD operations
- Sales management endpoints
- Authentication and authorization with OAuth2, JWT, and Keycloak
- Role-based access control for protected endpoints
- Layered architecture with Controller, Service, Repository, and Entity separation
- DTO mapping with MapStruct
- PostgreSQL persistence with Spring Data JPA
- Interactive API documentation with Swagger UI / OpenAPI
- Unit testing with JUnit and Mockito
- Continuous Integration with GitHub Actions

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

## Architecture

The application follows a layered architecture to keep responsibilities separated and the codebase maintainable.

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

- **Controller:** receives HTTP requests and returns responses
- **Service:** contains business logic and application rules
- **Repository:** handles database access through Spring Data JPA
- **Entity:** represents domain models persisted in the database
- **DTO / Mapper:** separates internal entities from external API representations

## Project Structure

```text
src/
 └── main/
     ├── java/
     │   └── ...
     └── resources/
 └── test/
     └── java/
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RafaelJuniorGutierrezBernal/vehicle-managment-api.git
cd vehicle-managment-api
```

### 2. Configure environment variables

Create a `.env` file based on the `.env.example` file.

### 3. Start required services

```bash
docker-compose up -d
```

### 4. Run the application

```bash
mvn spring-boot:run
```

## Environment Variables

The project expects environment variables for database and authentication setup. Use the following template:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/vehicle_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password

KEYCLOAK_SERVER_URL=http://localhost:8081
KEYCLOAK_REALM=vehicle-realm
KEYCLOAK_CLIENT_ID=vehicle-api
KEYCLOAK_CLIENT_SECRET=your_client_secret

JWT_ISSUER_URI=http://localhost:8081/realms/vehicle-realm
SERVER_PORT=8080
```

## API Documentation

Once the application is running, Swagger UI should be available at:

```text
http://localhost:8080/swagger-ui.html
```

If your project uses the newer SpringDoc path, also try:

```text
http://localhost:8080/swagger-ui/index.html
```

## Example Requests

### Get all vehicles

```bash
curl -X GET http://localhost:8080/api/vehicles
```

### Create a vehicle

```bash
curl -X POST http://localhost:8080/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2022
  }'
```

### Get all sales

```bash
curl -X GET http://localhost:8080/api/sales \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Running Tests

```bash
mvn test
```

## Continuous Integration

This repository includes a GitHub Actions workflow that runs the test suite automatically on push and pull request.

## Why this project matters

This project demonstrates practical backend skills in:

- Secure API development
- Role-based authorization
- Database design and persistence
- Layered architecture and clean code practices
- Testing and CI workflows
- Technical documentation for real-world collaboration

## Future Improvements

- Add integration tests for critical flows
- Improve Docker setup for full local environment bootstrap
- Add pagination and filtering for list endpoints
- Add centralized exception handling improvements
- Extend the domain with customers and inventory modules

## Author

**Rafael Junior Gutiérrez Bernal**

- GitHub: [RafaelJuniorGutierrezBernal](https://github.com/RafaelJuniorGutierrezBernal)
- LinkedIn: [rafaeljunior](https://www.linkedin.com/in/rafael-junior-gutierrez-bernal-03740a2b4/)
