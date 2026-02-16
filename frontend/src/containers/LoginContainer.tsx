import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLoginForm } from '../hooks/useLoginForm';
import { LoginForm } from '../components/features/auth/LoginForm';

export const LoginContainer: React.FC = () => {
    const { login } = useAuth();
    const {
        username,
        password,
        role,
        error,
        isLoading,
        setUsername,
        setPassword,
        setRole,
        fillDemoCredentials,
        handleSubmit,
    } = useLoginForm();

    return (
        <LoginForm
            username={username}
            password={password}
            role={role}
            error={error}
            isLoading={isLoading}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onRoleChange={setRole}
            onSubmit={handleSubmit(login)}
            onFillDemo={fillDemoCredentials}
        />
    );
};
