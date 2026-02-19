import apiClient, { setAuthCredentials, clearAuthCredentials, getAuthCredentials } from './client';
import { User, UserRole } from '../types/auth';


export const login = async (
    username: string,
    password: string,
    role: UserRole,
    studentIdOverride?: number
): Promise<User> => {
    try {
        // Set credentials for basic auth
        setAuthCredentials(username, password);

        let studentId: number | undefined;

        if (role === 'STUDENT') {
            studentId = studentIdOverride || 101;
            await apiClient.get(`/api/students/${studentId}`);
        } else {
            // For admin, just verify credentials with a simple call
            await apiClient.get('/api/courses?size=1');
        }

        return {
            username,
            role,
            studentId,
        };
    } catch (error) {
        clearAuthCredentials();
        throw new Error('Invalid credentials');
    }
};


export const logout = (): void => {
    clearAuthCredentials();
};

export { getAuthCredentials };
