import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useStudentProfile, useStudentSchedule } from '../hooks/useStudentData';
import { ProfileCard } from '../components/features/student/ProfileCard';
import { ScheduleTable } from '../components/features/student/ScheduleTable';
import { LoadingSkeleton, ErrorMessage } from '../components/common';
import { DashboardLayout } from '../components/layouts/DashboardLayout';

export const StudentDashboardContainer: React.FC = () => {
    const { user } = useAuth();
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
        <DashboardLayout
            title="Student Dashboard"
            welcomeMessage={`Welcome back, ${user?.username}!`}
            subtitle="Here's your academic overview"
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
        </DashboardLayout>
    );
};
