import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction, selectUser } from '../store/authSlice';
import { logout as logoutService } from '../api/authService';
import { StatCard } from './common/StatCard';
import { ActionCard } from './common/ActionCard';
import { useAdminStats } from '../hooks/useAdminStats';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const { stats, loading, error } = useAdminStats();

    const handleLogout = () => {
        logoutService();
        dispatch(logoutAction());
        navigate('/login');
    };

    // Icon components for reusability
    const UsersIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    const BookIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );

    const UserIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    const BuildingIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );

    const GroupIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );

    const ChartIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-600">{error || 'Failed to load dashboard'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition focus:ring-4 focus:ring-red-300"
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome, {user?.username}!</h2>
                    <p className="text-gray-600 mt-1">Administrative Control Panel</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Students"
                        value={stats.totalStudents}
                        subtitle={`${stats.studentsPerGrade} per grade level`}
                        icon={<UsersIcon />}
                        color="blue"
                    />
                    <StatCard
                        title="Total Courses"
                        value={stats.totalCourses}
                        subtitle={`${stats.coreCoursesCount} core, ${stats.electiveCoursesCount} elective`}
                        icon={<BookIcon />}
                        color="green"
                    />
                    <StatCard
                        title="Faculty"
                        value={stats.totalTeachers}
                        subtitle={`${stats.specializationsCount} specializations`}
                        icon={<UserIcon />}
                        color="purple"
                    />
                    <StatCard
                        title="Classrooms"
                        value={stats.totalClassrooms}
                        subtitle="Various room types"
                        icon={<BuildingIcon />}
                        color="orange"
                    />
                </div>

                {/* Quick Actions */}
                <section aria-labelledby="actions-heading">
                    <h3 id="actions-heading" className="text-2xl font-bold text-gray-800 mb-4">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ActionCard
                            title="View Students"
                            description="Browse all student profiles and academic records"
                            icon={<GroupIcon />}
                            color="blue"
                            onClick={() => {/* TODO: Navigate to students list */ }}
                            ariaLabel="View all students"
                        />
                        <ActionCard
                            title="Manage Courses"
                            description="Add, edit, or remove courses from the catalog"
                            icon={<BookIcon />}
                            color="green"
                            onClick={() => {/* TODO: Navigate to course management */ }}
                            ariaLabel="Manage courses"
                        />
                        <ActionCard
                            title="Reports"
                            description="Generate academic and enrollment reports"
                            icon={<ChartIcon />}
                            color="purple"
                            onClick={() => {/* TODO: Navigate to reports */ }}
                            ariaLabel="View reports"
                        />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
