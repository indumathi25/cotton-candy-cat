# Architecture & Modernization Decisions

This document provides a comprehensive technical overview of the Maplewood High project, explaining the architectural patterns, security implementations, and modern technologies used across the full stack.

---

## 🏗️ 1. Frontend Architecture (React)

### Modern Build & Compilation
- **Vite Migration**: Transitioned from Create React App to **Vite 7**. This provides lightning-fast development (ESM-based HMR) and optimized Rollup builds.
- **React Compiler**: Integrated the **React Runtime Compiler** (React 19). This eliminates the need for manual memoization (`useMemo`, `useCallback`) by automatically optimizing component rendering at build time.

### State Management & Data Fetching
- **Redux Toolkit**: Centralized state management for authentication and persistent UI states.
    - **Persistence**: Used `redux-persist` to sync the `auth` slice with `localStorage`, ensuring user sessions survive page refreshes.
- **TanStack Query (React Query)**: Handles all server-state synchronization.
    - **Caching**: Configured with a 5-minute `staleTime` and global error handling via `QueryCache` and `MutationCache`.
    - **Optimistic Updates**: Used for a snappy user experience during actions like course enrollment.

### Accessibility (a11y) & UI
- **Semantic HTML**: strictly used HTML5 semantic elements (`<main>`, `<nav>`, `<header>`, `<article>`) to ensure screen reader compatibility.
- **ARIA Patterns**: Components like `CourseCard` utilize `aria-label` and dynamic `disabled` states to provide meaningful context to assistive technologies.
- **Tailwind CSS**: Employs a utility-first CSS approach, resulting in a tiny CSS footprint and high performance via aggressive "Just-In-Time" (JIT) compilation.

---

## 🧩 2. Advanced Data Structures & Algorithms (DSA)

The system manages complex academic dependencies using advanced graph theory concepts.

### Prerequisite Management as a DAG
- **Directed Acyclic Graph (DAG)**: Course prerequisites are modeled as a DAG within the `PrerequisiteGraph` component.
- **Topological Sorting (DFS-based)**:
    - Implemented a Depth-First Search algorithm with **Cycle Detection** to generate valid graduation paths.
    - Ensures that no circular dependencies (e.g., A requires B, and B requires A) can exist in the curriculum.
- **Impact Analysis (BFS/Transitive Property)**:
    - **Downstream Impact**: Uses a Breadth-First Search (BFS) approach to identify all future courses that would be blocked if a student fails a specific prerequisite.
    - **Deep Prerequisite Traversal**: Provides O(N) transitive lookup to verify that students have completed all courses in a specific chain (e.g., Calc 1 -> Calc 2 -> Physics).

---

## ⚙️ 3. Backend Architecture (Spring Boot)

### Security & Data Protection
- **Spring Security 6.x**: Implemented a stateless security architecture.
    - **Authentication**: HTTP Basic Auth with **BCrypt** password hashing (Strongest standard for password storage).
    - **CORS Management**: Strict origin filtering restricted to the React frontend.
    - **Security Headers**: Hardened with **XSS Protection**, **Content Security Policy (CSP)**, **HSTS**, and **Frame Options (DENY)** to prevent clickjacking and injection attacks.
- **Role-Based Access Control (RBAC)**: Endpoints are secured based on user roles (`STUDENT`, `ADMIN`) using `authorizeHttpRequests`.

### Language Features & Data Persistence
- **Java 17/21 Features**: Leverages modern Java features including `records` (for DTOs), `LocalDateTime`, and the `Jakarta Persistence` (JPA) specification.
- **Transaction Management**: Used `@Transactional` at the service layer to ensure **ACID** properties. For instance, the enrollment process is atomic; if the database save fails, all pre-validations are rolled back.
- **Performance Indexing**: Database performance is optimized via JPA-level indexing.
    - *Example*: The `Student` entity includes `@Index` on the `email` column to ensure O(1) lookups during login.
- **Clean Service Layer**: Implemented a "Fetch -> Validate -> Save" pattern, delegating complex business rules to dedicated `Validator` components for high maintainability.

---

## 🌐 4. Full-Stack Integration & DevOps

### RESTful API Design
- **Stateless Communication**: The API follows REST principles, using standard HTTP methods (GET, POST, DELETE) and status codes (201 Created, 404 Not Found, 403 Forbidden).
- **Global Error Handling**: A `@ControllerAdvice` layer transforms backend exceptions into standardized JSON error responses for the frontend.

### Industrial Environment Management
- **Consolidated `.env`**: A single source of truth at the project root manages configurations for both environments.
- **Strict Prefixing**: Utilizes `VITE_` prefixing to safely expose variables to the client without leaking sensitive backend keys.
- **Build-Time Injection**: Frontend variables are "baked in" during the Docker build process, allowing for environment-specific images (Dev/Prod).

### Containerization (Docker)
- **Multi-Stage Builds**: 
    - *Phase 1 (Build)*: Compiles Java via Maven and bundles React via Vite.
    - *Phase 2 (Production)*: Serves the JAR via JRE and the static frontend via a lightweight **Nginx** alpine image.
- **Zero-Hardcoding Policy**: Dockerfiles use `ARG` and `ENV` mapping, ensuring no secrets or sensitive URLs are ever hardcoded in the image layers.

---
*Last Updated: February 2026*
