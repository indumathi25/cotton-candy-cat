import apiClient from './client';
import { StudentProfile, StudentSchedule, StudentCourseHistory, GradeReport } from '../types/api';

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
 * Get student's course history
 */
export const getStudentHistory = async (id: number): Promise<StudentCourseHistory> => {
    const response = await apiClient.get<StudentCourseHistory>(`/api/students/${id}/history`);
    return response.data;
};

/**
 * Get student's grade report
 */
export const getGradeReport = async (studentId: number): Promise<GradeReport> => {
    const response = await apiClient.get<GradeReport>(`/api/students/${studentId}/grades`);
    return response.data;
};
