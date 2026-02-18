export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const GRADE_LEVELS = [9, 10, 11, 12];

export const APP_NAME = 'Maplewood High';

export const API_ENDPOINTS = {
    COURSES: `${API_BASE_URL}/api/courses`,
    ENROLL: `${API_BASE_URL}/api/enrollments`,
    STUDENTS: `${API_BASE_URL}/api/students`,
    ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
};
