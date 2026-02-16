import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Store credentials in memory for HTTP Basic Auth
let authCredentials: { username: string; password: string } | null = null;

export const setAuthCredentials = (username: string, password: string) => {
    authCredentials = { username, password };
};

export const clearAuthCredentials = () => {
    authCredentials = null;
};

export const getAuthCredentials = () => authCredentials;

// Request interceptor to add Basic Auth header
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (authCredentials) {
            const token = btoa(`${authCredentials.username}:${authCredentials.password}`);
            config.headers.Authorization = `Basic ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Clear credentials on unauthorized
            clearAuthCredentials();
            // Could dispatch logout action here if needed
        }
        return Promise.reject(error);
    }
);

export default apiClient;
