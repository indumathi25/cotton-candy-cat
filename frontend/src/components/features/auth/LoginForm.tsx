import React, { FormEvent } from 'react';
import { Input, Button, Card } from '../../common';
import { UserRole } from '../../../types/auth';

interface LoginFormProps {
    username: string;
    password: string;
    studentId: string;
    role: UserRole;
    error: string;
    isLoading: boolean;
    onUsernameChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onStudentIdChange: (value: string) => void;
    onRoleChange: (value: UserRole) => void;
    onSubmit: (e: FormEvent) => void;
    onFillDemo: (role: UserRole) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    username,
    password,
    studentId,
    role,
    error,
    isLoading,
    onUsernameChange,
    onPasswordChange,
    onStudentIdChange,
    onRoleChange,
    onSubmit,
    onFillDemo,
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
            <Card className="w-full max-w-md border border-green-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">
                        Maplewood High School
                    </h1>
                    <p className="text-green-600">Student Management System</p>
                </div>

                {/* Login Form */}
                <form onSubmit={onSubmit} aria-label="Login form">
                    <Input
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => onUsernameChange(e.target.value)}
                        placeholder="Enter your username"
                        required
                        autoComplete="username"
                        aria-required="true"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        aria-required="true"
                    />

                    {role === 'STUDENT' && (
                        <Input
                            label="Student ID (for demo)"
                            type="text"
                            value={studentId}
                            onChange={(e) => onStudentIdChange(e.target.value)}
                            placeholder="Enter student ID (e.g. 101)"
                            required
                            aria-required="true"
                        />
                    )}

                    {/* Role Selection */}
                    <div className="mb-6">
                        <legend className="block text-sm font-medium text-gray-700 mb-2">
                            Login as
                        </legend>
                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="STUDENT"
                                    checked={role === 'STUDENT'}
                                    onChange={() => onRoleChange('STUDENT')}
                                    className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500"
                                    aria-label="Login as student"
                                />
                                <span className="ml-2 text-gray-700">Student</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="ADMIN"
                                    checked={role === 'ADMIN'}
                                    onChange={() => onRoleChange('ADMIN')}
                                    className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500"
                                    aria-label="Login as admin"
                                />
                                <span className="ml-2 text-gray-700">Admin</span>
                            </label>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div
                            role="alert"
                            aria-live="assertive"
                            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isLoading}
                        aria-label={isLoading ? 'Logging in...' : 'Login'}
                    >
                        Login
                    </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center mb-3">
                        Demo Credentials:
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onFillDemo('STUDENT')}
                            aria-label="Fill student demo credentials"
                        >
                            Student
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onFillDemo('ADMIN')}
                            aria-label="Fill admin demo credentials"
                        >
                            Admin
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
