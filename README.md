# Maplewood High School - Student Management System

A full-stack web application for managing student enrollment, course scheduling, and academic progress tracking.

## Overview

This system provides course enrollment management and academic tracking for high school students (grades 9-12), featuring real-time validation, GPA calculation, and schedule conflict detection.

## Technology Stack

**Backend**
- Spring Boot 3.x (Java 17)
- SQLite with Hibernate ORM
- Spring Security (HTTP Basic Auth)
- Maven

**Frontend**
- React 18 with TypeScript
- Tailwind CSS
- npm/Vite

## Prerequisites

- Java 17+
- Node.js 16+
- Maven 3.8+
- Python 3 (for database setup)
- Docker & Docker Compose (optional)

## Getting Started

### 1. Setup Database

```bash
# From project root
python3 populate_database.py
```

> **Note**: The script creates `maplewood_school.sqlite` in the project root. Docker Compose automatically mounts it from there.

### 2. Run with Docker (Recommended)

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

### Alternative: Run Locally

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Authentication

| Role    | Username  | Password   |
|---------|-----------|------------|
| ADMIN   | `admin`   | `admin`    |
| STUDENT | `student` | `password` |

## API Documentation

See [`backend/README.md`](backend/README.md) for detailed API testing guide.

**Quick Test:**
```bash
curl -u admin:admin http://localhost:8080/api/students/101 | jq
```

## Project Structure

```
cotton-candy-cat/
├── backend/              # Spring Boot API
│   ├── src/main/java/com/maplewood/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   └── config/
│   └── pom.xml
├── frontend/             # React App
│   ├── src/
│   └── package.json
├── populate_database.py
└── docker-compose.yml
```

## Best Practices

- **Transaction Management**: All write operations use `@Transactional` for data consistency
- **Input Validation**: Request DTOs validated with Jakarta Validation
- **Error Handling**: Centralized exception handling with meaningful error messages
- **Security**: Role-based access control on all endpoints
- **Code Organization**: Clean architecture with separated layers (Controller → Service → Repository)
- **Testing**: Run `./mvnw test` (backend) and `npm test` (frontend) before deployment

## License

Created for educational purposes.
