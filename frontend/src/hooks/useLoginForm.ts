import { useState, FormEvent } from 'react';
import { UserRole, User } from '../types/auth';

interface UseLoginFormReturn {
    username: string;
    password: string;
    studentId: string;
    role: UserRole;
    setUsername: (value: string) => void;
    setPassword: (value: string) => void;
    setStudentId: (value: string) => void;
    setRole: (value: UserRole) => void;
    fillDemoCredentials: (demoRole: UserRole) => void;
    handleSubmit: (onLogin: (username: string, password: string, role: UserRole, studentId?: number) => Promise<User>) => (e: FormEvent) => Promise<void>;
}

export const useLoginForm = (): UseLoginFormReturn => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [studentId, setStudentId] = useState('');
    const [role, setRole] = useState<UserRole>('STUDENT');

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

    const handleSubmit = (onLogin: (username: string, password: string, role: UserRole, studentId?: number) => Promise<User>) => {
        return async (e: FormEvent): Promise<void> => {
            e.preventDefault();
            const parsedStudentId = role === 'STUDENT' ? parseInt(studentId, 10) : undefined;
            await onLogin(username, password, role, isNaN(parsedStudentId as number) ? undefined : parsedStudentId).catch(() => {
                // Error managed by useAuth mutation
            });
        };
    };

    return {
        username,
        password,
        studentId,
        role,
        setUsername,
        setPassword,
        setStudentId,
        setRole,
        fillDemoCredentials,
        handleSubmit,
    };
};
