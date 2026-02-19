import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdminStats } from '../hooks/useAdminData';
import { StatCard } from '../components/features/admin/StatCard';
import { Button, Card, LoadingSkeleton, ErrorMessage } from '../components/common';
import { DashboardLayout } from '../components/layouts/DashboardLayout';

export const AdminDashboardContainer: React.FC = () => {
    const { user } = useAuth();
    const { data: stats, isLoading, isError, refetch } = useAdminStats();

    return (
        <DashboardLayout
            title="Admin Dashboard"
            welcomeMessage={`Welcome, ${user?.username}`}
            subtitle="System Overview"
        >
            {/* Statistics Grid */}
            <section aria-labelledby="stats-heading" className="mb-8">
                <h3 id="stats-heading" className="sr-only">
                    System Statistics
                </h3>
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} variant="card" />)}
                    </div>
                ) : isError ? (
                    <ErrorMessage message="Failed to load statistics" onRetry={refetch} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Total Students"
                            value={stats?.totalStudents.toString() || '0'}
                            icon="👨‍🎓"
                            color="blue"
                        />
                        <StatCard
                            label="Active Courses"
                            value={stats?.activeCourses.toString() || '0'}
                            icon="📚"
                            color="green"
                        />
                        <StatCard
                            label="Faculty Members"
                            value={stats?.totalTeachers.toString() || '0'}
                            icon="👩‍🏫"
                            color="purple"
                        />
                        <StatCard
                            label="Classrooms"
                            value={stats?.totalClassrooms.toString() || '0'}
                            icon="🏫"
                            color="orange"
                        />
                    </div>
                )}
            </section>

            {/* Quick Actions */}
            <section aria-labelledby="actions-heading">
                <h3 id="actions-heading" className="text-2xl font-bold text-gray-800 mb-4">
                    Quick Actions
                </h3>
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Button variant="primary" fullWidth>
                            📋 View All Students
                        </Button>
                        <Button variant="success" fullWidth>
                            ➕ Add New Course
                        </Button>
                        <Button variant="secondary" fullWidth>
                            📊 Generate Reports
                        </Button>
                    </div>
                </Card>
            </section>
        </DashboardLayout>
    );
};
