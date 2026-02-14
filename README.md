# Cotton Candy Cat - Full Stack Application

This project is a full-stack application featuring a Spring Boot backend and a React frontend.

## Project Structure

- `backend/`: Spring Boot (Java 17) & SQLite.
- `frontend/`: React (TypeScript) & Tailwind CSS.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Run with Docker (Recommended)

To build and start the entire application stack:

```bash
docker compose up --build
```

- **Frontend**: [http://localhost](http://localhost)
- **Backend**: [http://localhost:8080](http://localhost:8080)

### Manual Setup (Development)

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Documentation
Additional details can be found in the [walkthrough.md](.gemini/antigravity/brain/ccf70b74-64da-4fbd-b85a-a9458da96be4/walkthrough.md) (if available).
