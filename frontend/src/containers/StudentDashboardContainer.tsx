import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useStudentProfile, useStudentSchedule } from '../hooks/useStudentData';
import { ProfileCard } from '../components/features/student/ProfileCard';
import { ScheduleTable } from '../components/features/student/ScheduleTable';
import { LoadingSkeleton, ErrorMessage } from '../components/common';
import { StudentLayout } from '../components/layouts/StudentLayout';

export const StudentDashboardContainer: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const studentId = user?.studentId || 101;

    const {
        data: profile,
        isLoading: profileLoading,
        isError: profileError,
        refetch: refetchProfile,
    } = useStudentProfile(studentId);

    const {
        data: schedule,
        isLoading: scheduleLoading,
        isError: scheduleError,
        refetch: refetchSchedule,
    } = useStudentSchedule(studentId);

    return (
        <StudentLayout
            title="Student Dashboard"
        >
            {/* Profile Section */}
            <section aria-labelledby="profile-heading" className="mb-8">
                <h3 id="profile-heading" className="sr-only">
                    Student Profile
                </h3>
                {profileLoading ? (
                    <LoadingSkeleton variant="card" />
                ) : profileError ? (
                    <ErrorMessage
                        message="Failed to load profile data"
                        onRetry={refetchProfile}
                    />
                ) : profile ? (
                    <ProfileCard profile={profile} />
                ) : null}
            </section>

            {/* Quick Actions */}
            <section aria-labelledby="actions-heading" className="mb-8">
                <h3 id="actions-heading" className="text-xl font-bold text-gray-800 mb-4">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/student/courses')}
                        className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
                        aria-label="Browse available courses"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                        <span className="text-lg font-semibold">Browse Courses</span>
                    </button>
                </div>
            </section>

            {/* Schedule Section */}
            <section aria-labelledby="schedule-heading">
                <h3 id="schedule-heading" className="text-2xl font-bold text-gray-800 mb-4">
                    Current Semester Schedule
                </h3>
                {scheduleLoading ? (
                    <LoadingSkeleton variant="table" />
                ) : scheduleError ? (
                    <ErrorMessage
                        message="Failed to load schedule"
                        onRetry={refetchSchedule}
                    />
                ) : schedule ? (
                    <ScheduleTable schedule={schedule} />
                ) : null}
            </section>
        </StudentLayout>
    );
};
