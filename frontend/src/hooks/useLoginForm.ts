import { useState, FormEvent } from 'react';
import { UserRole } from '../types/auth';

interface UseLoginFormReturn {
    username: string;
    password: string;
    role: UserRole;
    error: string;
    isLoading: boolean;
    setUsername: (value: string) => void;
    setPassword: (value: string) => void;
    setRole: (value: UserRole) => void;
    setError: (value: string) => void;
    setIsLoading: (value: boolean) => void;
    fillDemoCredentials: (demoRole: UserRole) => void;
    handleSubmit: (onLogin: (username: string, password: string, role: UserRole) => Promise<void>) => (e: FormEvent) => Promise<void>;
}

export const useLoginForm = (): UseLoginFormReturn => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('STUDENT');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fillDemoCredentials = (demoRole: UserRole): void => {
        if (demoRole === 'STUDENT') {
            setUsername('student');
            setPassword('password');
            setRole('STUDENT');
        } else {
            setUsername('admin');
            setPassword('admin');
            setRole('ADMIN');
        }
    };

    const handleSubmit = (onLogin: (username: string, password: string, role: UserRole) => Promise<void>) => {
        return async (e: FormEvent): Promise<void> => {
            e.preventDefault();
            setError('');
            setIsLoading(true);

            try {
                await onLogin(username, password, role);
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
        role,
        error,
        isLoading,
        setUsername,
        setPassword,
        setRole,
        setError,
        setIsLoading,
        fillDemoCredentials,
        handleSubmit,
    };
};
