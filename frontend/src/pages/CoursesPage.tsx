import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { CourseBrowser } from '../components/features/courses/CourseBrowser';
import { StudentLayout } from '../components/layouts/StudentLayout';
import { selectUser } from '../store/authSlice';
import { setSelectedGrade, selectSelectedGrade, setSearchTerm, selectSearchTerm } from '../store/uiSlice';
import {
    enrollStudent,
    selectNotifications,
    dismissNotification,
    selectPendingSections,
} from '../store/enrollmentSlice';
import {
    fetchStudentHistory,
    selectStudentHistory,
} from '../store/studentSlice';
import { LoadingSkeleton } from '../components/common';
import { useStudentProfile } from '../hooks/useStudentData';
import { useCourses } from '../hooks/useCourseData';
import { enrichCoursesWithEnrollmentStatus } from '../utils/enrollmentValidation';
import { AppDispatch } from '../store';

export const CoursesPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const queryClient = useQueryClient();

    const user = useSelector(selectUser);
    const selectedGrade = useSelector(selectSelectedGrade);
    const searchTerm = useSelector(selectSearchTerm);
    const notifications = useSelector(selectNotifications);
    const pendingSections = useSelector(selectPendingSections);
    const studentCourseHistory = useSelector(selectStudentHistory);
    const studentId = user?.studentId || 101;

    const { data: profile, isLoading: profileLoading } = useStudentProfile(studentId);

    // Fetch courses with infinite query support
    const {
        data: coursesData,
        isLoading: coursesLoading,
        isError: coursesError,
        refetch: refetchCourses,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useCourses(selectedGrade || undefined, searchTerm || undefined);

    // Flatten pages into a single courses list
    const allCourses = coursesData?.pages.flatMap(page => page.content) || [];

    // Enrich courses with enrollment status
    const enrichedCourses = enrichCoursesWithEnrollmentStatus(
        allCourses,
        profile?.gradeLevel || 9,
        studentCourseHistory
    );

    useEffect(() => {
        dispatch(fetchStudentHistory(studentId));
    }, [dispatch, studentId]);

    const handleEnroll = async (courseId: number) => {
        if (!user?.studentId) return;

        const result = await dispatch(enrollStudent({ studentId: user.studentId, courseId }));

        // On success, invalidate react-query cache so schedule/profile refresh,
        // and re-fetch history into Redux so validation reflects new enrollment
        if (enrollStudent.fulfilled.match(result)) {
            queryClient.invalidateQueries({ queryKey: ['student', 'schedule', studentId] });
            queryClient.invalidateQueries({ queryKey: ['student', 'profile', studentId] });
            dispatch(fetchStudentHistory(studentId));
        }
    };

    if (profileLoading) {
        return (
            <StudentLayout title="Browse Courses">
                <LoadingSkeleton lines={5} />
            </StudentLayout>
        );
    }

    return (
        <StudentLayout title="Browse Courses">
            {/* ── Redux-powered toast notifications ───────────────────── */}
            {notifications.length > 0 && (
                <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            className={`flex items-start gap-3 rounded-lg shadow-lg p-4 text-white
                                ${n.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
                        >
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{n.title}</p>
                                <p className="text-xs mt-0.5 opacity-90">{n.message}</p>
                            </div>
                            <button
                                onClick={() => dispatch(dismissNotification(n.id))}
                                className="text-white opacity-70 hover:opacity-100 text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <CourseBrowser
                courses={enrichedCourses}
                isLoading={coursesLoading}
                isError={coursesError}
                onRetry={refetchCourses}
                selectedGrade={selectedGrade}
                onGradeChange={(grade) => dispatch(setSelectedGrade(grade))}
                searchTerm={searchTerm}
                onSearchChange={(term) => dispatch(setSearchTerm(term))}
                studentGradeLevel={profile?.gradeLevel || 9}
                onEnroll={handleEnroll}
                pendingCourseIds={pendingSections}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={fetchNextPage}
            />
        </StudentLayout>
    );
};
