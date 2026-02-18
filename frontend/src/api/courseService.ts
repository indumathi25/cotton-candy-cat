import apiClient from './client';
import { Course } from '../types/course';
import { CourseSection } from '../types/student';
import { PageResponse } from '../types/api';

/**
 * Fetches courses with optional grade filter and pagination
 */
export const getCourses = async (grade?: number, page: number = 0, size: number = 20): Promise<PageResponse<Course>> => {
    const params: any = { page, size };
    if (grade) {
        params.grade = grade;
    }

    const response = await apiClient.get<PageResponse<Course>>('/api/courses', { params });
    return response.data;
};

/**
 * Fetches a specific course by ID
 */
export const getCourseById = async (id: number): Promise<Course> => {
    const response = await apiClient.get<Course>(`/api/courses/${id}`);
    return response.data;
};

/**
 * Fetches sections for a specific course
 */
export const getCourseSections = async (courseId: number): Promise<CourseSection[]> => {
    const response = await apiClient.get<CourseSection[]>(`/api/courses/${courseId}/sections`);
    return response.data;
};

/**
 * Enrolls a student in a course section
 */
export const enrollInCourse = async (studentId: number, sectionId: number): Promise<any> => {
    const response = await apiClient.post<any>('/api/enrollments', {
        studentId,
        courseSectionId: sectionId,
    });
    return response.data;
};
