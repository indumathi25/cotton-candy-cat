import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useStudentProfile, useStudentSchedule, useStudentHistory } from '../hooks/useStudentData';
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

    const {
        data: history,
        isLoading: historyLoading,
    } = useStudentHistory(studentId);

    return (
        <StudentLayout
            title="Student Dashboard"
        >
            {/* Profile Section */}
            <section aria-labelledby="profile-heading" className="mb-8">
                <h3 id="profile-heading" className="sr-only">
                    Student Profile
                </h3>
                {profileLoading || historyLoading ? (
                    <LoadingSkeleton variant="card" />
                ) : profileError ? (
                    <ErrorMessage
                        message="Failed to load profile data"
                        onRetry={refetchProfile}
                    />
                ) : profile ? (
                    <ProfileCard profile={profile} history={history} />
                ) : null}
            </section>

            {/* Schedule Section */}
            <section aria-labelledby="schedule-heading">
                <h3 id="schedule-heading" className="text-3xl font-extrabold text-gray-900 mb-8 mt-12">
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
