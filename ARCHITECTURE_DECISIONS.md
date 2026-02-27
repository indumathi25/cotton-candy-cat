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
- **Input Sanitization**: Integrated **DOMPurify** to sanitize user-generated content and effectively prevent Cross-Site Scripting (XSS) attacks.

---

## 🧩 2. Advanced Data Structures & Algorithms (DSA)

The system manages complex academic dependencies using advanced graph theory concepts.

### Prerequisite Management as a DAG
- **Directed Acyclic Graph (DAG)**: Course prerequisites are modeled as a DAG within the `PrerequisiteGraph` component.
- **Topological Sorting (Kahn's Algorithm)**:
    - Used to detect circular dependencies at startup and generate valid graduation paths.
    - Ensures no circular chains can bypass the enrollment guard.
- **Startup-Cached Deep Prerequisites** *(Performance Optimization)*:
    - `PrerequisiteGraphInitializer` listens for `ApplicationReadyEvent` and calls `buildGraph()` exactly once after data seeding completes.
    - During `buildGraph()`, `computeDeepPrerequisites()` is called for every course, and results are stored in a `deepPrerequisitesCache: Map<Long, List<Course>>`.
    - Enrollment validation calls `getDeepPrerequisites(courseId)` → **pure `Map.get()` lookup, O(1)**. Zero graph traversal at runtime.
- **Batch DB Query for Verification**:
    - Instead of N individual queries (one per prerequisite), a single JPQL query fetches all of the student's `passed` course IDs.
    - Verification is done in-memory via `Set<Long>` for **O(1) per check**.
- **Impact Analysis (BFS/Transitive Property)**:
    - **Downstream Impact**: Uses BFS to identify all future courses blocked by a failure.

### Academic Metrics Calculation
- **GPA Calculation Engine**: Implemented a weighted GPA calculation logic in `AcademicCalculator`. It accounts for course credits and assigned letter grades (A-F), converting them to a 4.0 scale.
- **Progress Tracking**: Dynamically calculates "Credits Earned" vs. "Credits to Graduate," providing a real-time progress percentage for student degree completion.

---

## ⚙️ 3. Backend Architecture (Spring Boot 4.0)

### Security & Data Protection
- **Spring Security 7.x**: Implemented a stateless security architecture for the next-gen Spring framework.
    - **Authentication**: HTTP Basic Auth with **BCrypt** password hashing (Strongest standard for password storage).
    - **CORS Management**: Strict origin filtering restricted to the React frontend.
    - **Security Headers**: Hardened with **XSS Protection**, **Content Security Policy (CSP)**, **HSTS**, and **Frame Options (DENY)** to prevent clickjacking and injection attacks.
    - **Input Validation**: Uses Spring's built-in validation (`@Valid`, `@NotNull`) to sanitize inputs and prevent injection attacks.
- **Role-Based Access Control (RBAC)**: Endpoints are secured based on user roles (`STUDENT`, `ADMIN`) using `authorizeHttpRequests`.

### Language Features & Data Persistence
- **Java 25 Features**: Leverages modern Java features including `records` (for DTOs), `LocalDateTime`, and the `Jakarta Persistence` (JPA) specification.
- **JSpecify Null Safety**: Migrated from the deprecated `org.springframework.lang.NonNull` to **`org.jspecify.annotations.NonNull`** (the Spring 7.0 / Java 25 standard for null-safety annotations), backed by `org.jspecify:jspecify:1.0.0`.
- **Database**: Exclusively uses **PostgreSQL 17** via Spring Data JPA / Hibernate. SQLite has been fully removed. The `DataInitializer` (`CommandLineRunner`) auto-seeds the database on first run.
- **Transaction Management**: Used `@Transactional` at the service layer to ensure **ACID** properties. For instance, the enrollment process is atomic; if the database save fails, all pre-validations are rolled back.
- **Performance Indexing**: Database performance is optimized via JPA-level indexing.
    - *Example*: The `Student` entity includes `@Index` on the `email` column to ensure fast lookups.
- **Clean Service Layer**: Implemented a "Fetch → Validate → Save" pattern, delegating complex business rules to dedicated `Validator` components for high maintainability.
- **Decoupled Mapping (MapStruct)**: Utilizes **MapStruct** to strictly separate persistence models (Entities) from API contracts (DTOs).
- **Dedicated Academic Logic**: Academic calculations (GPA, Credits) are encapsulated in the `AcademicCalculator` utility, ensuring the service layer remains focused on orchestration.

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

## 🚀 5. Future Enhancements

### Planned Security Upgrades
- **Authentication & Authorization**
  - Migrate to **Auth0** using **OAuth 2.0 Authorization Code Flow with PKCE**
  - **Rationale**: Authorization Code Flow with PKCE is the recommended best practice for Single Page Applications (SPAs) such as React. It prevents exposing client secrets in the frontend and mitigates authorization code interception attacks.
  - **Backend Security**:
    - JWT validation using Auth0’s **JWKS endpoint**
    - Role-based access control (RBAC) enforced server-side
    - CSRF protection for state-changing endpoints
    - Secure HTTP headers (CSP, HSTS, X-Content-Type-Options)
- **Dependency Management**
  - Integrate **Snyk** or **OWASP Dependency-Check** in the CI/CD pipeline to flag vulnerable libraries.

---
*Last Updated: February 2026 (Updated with Java 25, Spring Boot 4.0, PostgreSQL, JSpecify null-safety, and startup-cached DAG prerequisite optimization)*
