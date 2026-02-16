import React, { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common';

interface DashboardLayoutProps {
    title: string;
    welcomeMessage?: string;
    subtitle?: string;
    children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    title,
    welcomeMessage,
    subtitle,
    children,
}) => {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {title}
                        </h1>
                        <Button
                            variant="danger"
                            onClick={logout}
                            aria-label="Logout"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                {welcomeMessage && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            {welcomeMessage}
                        </h2>
                        {subtitle && (
                            <p className="text-gray-600 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Dashboard Content */}
                {children}
            </main>
        </div>
    );
};
