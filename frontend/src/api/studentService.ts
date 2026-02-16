import apiClient from './client';
import { StudentProfile, StudentSchedule, Course, PageResponse } from '../types/api';

/**
 * Get student profile with GPA and academic progress
 */
export const getStudentProfile = async (id: number): Promise<StudentProfile> => {
    const response = await apiClient.get<StudentProfile>(`/api/students/${id}`);
    return response.data;
};

/**
 * Get student's current semester schedule
 */
export const getStudentSchedule = async (id: number): Promise<StudentSchedule> => {
    const response = await apiClient.get<StudentSchedule>(`/api/students/${id}/schedule`);
    return response.data;
};

/**
 * Get available courses with optional filters
 */
export const getCourses = async (
    grade?: number,
    page: number = 0,
    size: number = 20
): Promise<PageResponse<Course>> => {
    const params: Record<string, any> = { page, size };
    if (grade) {
        params.grade = grade;
    }

    const response = await apiClient.get<PageResponse<Course>>('/api/courses', { params });
    return response.data;
};
