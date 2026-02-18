import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLoginForm } from '../hooks/useLoginForm';
import { LoginForm } from '../components/features/auth/LoginForm';

export const LoginContainer: React.FC = () => {
    const { login, isLoading, error } = useAuth();
    const {
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
    } = useLoginForm();

    return (
        <LoginForm
            username={username}
            password={password}
            studentId={studentId}
            role={role}
            error={error?.message || ''}
            isLoading={isLoading}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onStudentIdChange={setStudentId}
            onRoleChange={setRole}
            onSubmit={handleSubmit(login)}
            onFillDemo={fillDemoCredentials}
        />
    );
};
