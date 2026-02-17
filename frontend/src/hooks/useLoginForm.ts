import { useState, FormEvent } from 'react';
import { UserRole } from '../types/auth';

interface UseLoginFormReturn {
    username: string;
    password: string;
    studentId: string;
    role: UserRole;
    error: string;
    isLoading: boolean;
    setUsername: (value: string) => void;
    setPassword: (value: string) => void;
    setStudentId: (value: string) => void;
    setRole: (value: UserRole) => void;
    setError: (value: string) => void;
    setIsLoading: (value: boolean) => void;
    fillDemoCredentials: (demoRole: UserRole) => void;
    handleSubmit: (onLogin: (username: string, password: string, role: UserRole, studentId?: number) => Promise<void>) => (e: FormEvent) => Promise<void>;
}

export const useLoginForm = (): UseLoginFormReturn => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [studentId, setStudentId] = useState('');
    const [role, setRole] = useState<UserRole>('STUDENT');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fillDemoCredentials = (demoRole: UserRole): void => {
        if (demoRole === 'STUDENT') {
            setUsername(process.env.REACT_APP_STUDENT_USERNAME || 'student');
            setPassword(process.env.REACT_APP_STUDENT_PASSWORD || 'password');
            setStudentId('101');
            setRole('STUDENT');
        } else {
            setUsername(process.env.REACT_APP_ADMIN_USERNAME || 'admin');
            setPassword(process.env.REACT_APP_ADMIN_PASSWORD || 'admin');
            setStudentId('');
            setRole('ADMIN');
        }
    };

    const handleSubmit = (onLogin: (username: string, password: string, role: UserRole, studentId?: number) => Promise<void>) => {
        return async (e: FormEvent): Promise<void> => {
            e.preventDefault();
            setError('');
            setIsLoading(true);

            try {
                const parsedStudentId = role === 'STUDENT' ? parseInt(studentId, 10) : undefined;
                await onLogin(username, password, role, isNaN(parsedStudentId as number) ? undefined : parsedStudentId);
            } catch (err) {
                setError('Invalid credentials. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
    };

    return {
        username,
        password,
        studentId,
        role,
        error,
        isLoading,
        setUsername,
        setPassword,
        setStudentId,
        setRole,
        setError,
        setIsLoading,
        fillDemoCredentials,
        handleSubmit,
    };
};
