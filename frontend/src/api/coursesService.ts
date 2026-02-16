import apiClient from './client';
import { Course } from '../types/course';
import { PageResponse } from '../types/api';

export const getCourses = async (grade?: number, page: number = 0, size: number = 20): Promise<PageResponse<Course>> => {
    const params: any = { page, size };
    if (grade) {
        params.grade = grade;
    }

    const response = await apiClient.get('/api/courses', { params });
    return response.data;
};

export const getCourseById = async (id: number): Promise<Course> => {
    const response = await apiClient.get(`/api/courses/${id}`);
    return response.data;
};
