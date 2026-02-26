import React from 'react';
import { CourseWithEnrollmentStatus } from '../../../types/course';
import { CourseCard } from './CourseCard';
import { LoadingSkeleton, ErrorMessage } from '../../common';

interface CourseListProps {
    courses: CourseWithEnrollmentStatus[];
    isLoading: boolean;
    isError: boolean;
    onEnroll: (courseId: number) => void;
    onRetry?: () => void;
    pendingCourseIds?: number[];
}

export const CourseList: React.FC<CourseListProps> = ({
    courses,
    isLoading,
    isError,
    onEnroll,
    onRetry,
    pendingCourseIds = [],
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <LoadingSkeleton key={i} variant="card" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <ErrorMessage
                message="Failed to load courses"
                onRetry={onRetry}
            />
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600">
                    Try adjusting your filters or check back later for new courses.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
                <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={onEnroll}
                    isEnrolling={pendingCourseIds.includes(course.id)}
                />
            ))}
        </div>
    );
};
