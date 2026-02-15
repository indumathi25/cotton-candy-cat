# Maplewood High School - Backend API

A Spring Boot REST API for managing student enrollment, course scheduling, and academic tracking at Maplewood High School.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Testing Guide](#api-testing-guide)
  - [Student Endpoints](#student-endpoints)
  - [Course Endpoints](#course-endpoints)
  - [Enrollment Endpoints](#enrollment-endpoints)
- [Data Model](#data-model)

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- SQLite (included via JDBC driver)

## Getting Started

### 1. Populate the Database

Before running the API, populate the database with sample data:

```bash
# From the project root directory
python3 populate_database.py

# Move the database to the backend directory
cp maplewood_school.sqlite backend/
```

This creates:
- **400 students** (100 per grade: 9, 10, 11, 12)
- **6,455 course history records**
- **57 courses** (20 core + 37 electives)
- **50 teachers**
- **60 classrooms**

### 2. Run the Application

```bash
cd backend
mvn spring-boot:run
```

The API will start on `http://localhost:8080`

## Authentication

All endpoints require HTTP Basic Authentication:

| Username | Password | Role    |
|----------|----------|---------|
| `student` | `password` | STUDENT |
| `admin`   | `admin`    | ADMIN   |

**Example:**
```bash
curl -u admin:admin http://localhost:8080/api/students/101
```

## API Testing Guide

### Student Endpoints

#### Get Student Profile

Retrieves a student's academic profile including GPA, credits earned, and graduation progress.

**Endpoint:** `GET /api/students/{id}`

**Authorization:** Any authenticated user

**Example Request:**
```bash
# Test with a 10th grader who has course history
curl -u admin:admin http://localhost:8080/api/students/101 | jq
```

**Example Response:**
```json
{
  "id": 101,
  "fullName": "Joseph Young",
  "gradeLevel": 10,
  "gpa": 4.0,
  "creditsEarned": 4,
  "creditsToGraduate": 22,
  "remainingCredits": 18,
  "progressPercentage": 18.18
}
```

> [!NOTE]
> **Grade 9 students** (IDs 1-100) will have `gpa: 0.0` and `creditsEarned: 0` because they are in their first semester with no completed course history yet. Test with **grade 10-12 students** (IDs 101-400) to see GPA calculations.

---

#### Get Student Schedule

Retrieves the student's current course schedule for the active semester.

**Endpoint:** `GET /api/students/{id}/schedule`

**Authorization:** STUDENT or ADMIN role

**Example Request:**
```bash
curl -u admin:admin http://localhost:8080/api/students/{studentId}/schedule | jq
```

**Example Response:**
```json
{
  "studentId": 101,
  "studentName": "Joseph Young",
  "semesterName": "Fall 2024",
  "schedule": [
    {
      "courseName": "English II: Literature",
      "courseCode": "ENG201",
      "teacherName": "Mary Smith",
      "classroomId": "Room-105",
      "dayOfWeek": "Monday",
      "startTime": "09:00",
      "endTime": "10:00"
    }
  ]
}
```

---

### Course Endpoints

#### Get Courses

Retrieves a paginated list of available courses, optionally filtered by grade level.

**Endpoint:** `GET /api/courses`

**Authorization:** Any authenticated user

**Query Parameters:**
- `grade` (optional): Filter courses by grade level (9-12)
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `sort` (optional): Sort field and direction (e.g., `name,asc`)

**Example Requests:**

```bash
# Get all courses (first page)
curl -u admin:admin "http://localhost:8080/api/courses" | jq

# Get courses for grade 9
curl -u admin:admin "http://localhost:8080/api/courses?grade=9" | jq

# Get second page with 10 courses per page, sorted by name
curl -u admin:admin "http://localhost:8080/api/courses?page=1&size=10&sort=name,asc" | jq
```

**Example Response:**
```json
{
  "content": [
    {
      "id": 1,
      "code": "ENG101",
      "name": "English I: Foundations",
      "description": "Basic writing and literature",
      "credits": 1.0,
      "courseType": "core",
      "gradeLevelMin": 9,
      "gradeLevelMax": 9
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 57,
  "totalPages": 3
}
```

---

### Enrollment Endpoints

#### Enroll Student in Course

Enrolls a student in a course section with comprehensive validation.

**Endpoint:** `POST /api/enroll`

**Authorization:** STUDENT role

**Request Body:**
```json
{
  "studentId": 1,
  "courseSectionId": 1
}
```

**Validation Rules:**
1. ✓ Section must be in the active semester
2. ✓ Student not already enrolled in the section
3. ✓ Maximum 5 courses per semester
4. ✓ Student's grade level matches course requirements
5. ✓ Section has available capacity
6. ✓ Prerequisites are met
7. ✓ No time conflicts with existing schedule

**Example Request:**
```bash
curl -u student:password \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseSectionId": 1
  }' \
  http://localhost:8080/api/enroll | jq
```

**Success Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Enrollment successful",
  "studentId": 1,
  "studentName": "James Diaz",
  "courseCode": "ENG101",
  "courseName": "English I: Foundations",
  "section": "Section A",
  "semesterName": "Fall 2024"
}
```

**Validation Error Response (400 Bad Request):**
```json
{
  "status": "FAILED",
  "message": "Maximum course limit (5) reached for this semester",
  "studentId": 1,
  "studentName": "James Diaz",
  "courseCode": "ENG101",
  "courseName": "English I: Foundations",
  "section": null,
  "semesterName": null
}
```

---

## Data Model

### Student IDs by Grade Level

| Grade Level | Student IDs | Course History |
|-------------|-------------|----------------|
| 9th Grade   | 1 - 100     | None (first semester) |
| 10th Grade  | 101 - 200   | ~13-14 courses |
| 11th Grade  | 201 - 300   | ~20+ courses |
| 12th Grade  | 301 - 400   | ~25+ courses |

### GPA Calculation

- **Weighted by credits**: Higher credit courses have more impact
- **Based on passed courses only**: Failed courses don't count toward GPA
- **Grade points**: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0
- **Default**: Courses with "passed" status but no letter grade = 4.0

### Semester Information

- **Active Semester**: Fall 2024
- **Historical Semesters**: Fall 2021 through Spring 2023 (6 semesters)
- **Future Semesters**: Spring 2024, Fall 2025

---

## Common Testing Scenarios

### Test GPA Calculation
```bash
# Student with course history (grade 10+)
curl -u admin:admin http://localhost:8080/api/students/101 | jq .gpa
```

### Test Course Filtering
```bash
# Get all courses eligible for 9th graders
curl -u admin:admin "http://localhost:8080/api/courses?grade=9" | jq '.content[] | {code, name, gradeLevelMin}'
```

### Test Enrollment Validation
```bash
# Try to enroll (requires finding available course sections first)
curl -u student:password \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "courseSectionId": 1}' \
  http://localhost:8080/api/enroll | jq
```

---

## Technology Stack

- **Framework**: Spring Boot 3.x
- **Database**: SQLite with Hibernate
- **Security**: Spring Security with HTTP Basic Auth
- **Build Tool**: Maven
- **Java Version**: 17+

## Error Handling

All endpoints return standardized error responses:

```json
{
  "path": "/api/students/999",
  "error": "Not Found",
  "message": "Student not found with id: 999",
  "timestamp": "2026-02-15T16:16:54.275643050",
  "status": 404
}
```

Common HTTP status codes:
- `200 OK`: Success
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing or invalid credentials
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
