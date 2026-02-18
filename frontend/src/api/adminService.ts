import apiClient from './client';

export interface AdminStats {
    totalStudents: number;
    activeCourses: number;
    totalTeachers: number;
    totalClassrooms: number;
}

/**
 * Fetches overview statistics for the admin dashboard
 */
export const getAdminStats = async (): Promise<AdminStats> => {
    const response = await apiClient.get<AdminStats>('/api/admin/stats');
    return response.data;
};
