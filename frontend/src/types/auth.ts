// Authentication types
export type UserRole = 'STUDENT' | 'ADMIN';

export interface User {
    username: string;
    role: UserRole;
    studentId?: number; // For students only
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    credentials: {
        username: string;
        password: string;
    } | null;
}

export interface LoginRequest {
    username: string;
    password: string;
    role: UserRole;
}
