import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import { login as loginService } from '../api/authService';
import { UserRole } from '../types/auth';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('STUDENT');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await loginService(username, password, role);
            dispatch(setUser({ user, credentials: { username, password } }));

            // Navigate to appropriate dashboard based on role
            if (role === 'STUDENT') {
                navigate('/student');
            } else {
                navigate('/admin');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Pre-fill demo credentials
    const fillDemoCredentials = (demoRole: UserRole) => {
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-green-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">
                        Maplewood High School
                    </h1>
                    <p className="text-green-600">Student Management System</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} aria-label="Login form">
                    {/* Username */}
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            placeholder="Enter your username"
                            required
                            autoComplete="username"
                            aria-required="true"
                            aria-describedby={error ? 'login-error' : undefined}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                            aria-required="true"
                            aria-describedby={error ? 'login-error' : undefined}
                        />
                    </div>

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
                                    onChange={() => setRole('STUDENT')}
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
                                    onChange={() => setRole('ADMIN')}
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
                            id="login-error"
                            role="alert"
                            aria-live="assertive"
                            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-green-300"
                        aria-label={isLoading ? 'Logging in...' : 'Login'}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Logging in...</span>
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center mb-3">
                        Demo Credentials:
                    </p>
                    <div className="flex gap-2 justify-center">
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('STUDENT')}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition focus:ring-2 focus:ring-gray-400"
                            aria-label="Fill student demo credentials"
                        >
                            Student (student/password)
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemoCredentials('ADMIN')}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition focus:ring-2 focus:ring-gray-400"
                            aria-label="Fill admin demo credentials"
                        >
                            Admin (admin/admin)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
