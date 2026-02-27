import React from 'react';
import { CourseWithEnrollmentStatus } from '../../../types/course';
import { CourseFilters } from './CourseFilters';
import { CourseList } from './CourseList';

interface CourseBrowserProps {
    courses: CourseWithEnrollmentStatus[];
    isLoading: boolean;
    isError: boolean;
    onRetry?: () => void;
    selectedGrade: number | null;
    onGradeChange: (grade: number | null) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onEnroll: (courseId: number) => void;
    studentGradeLevel: number;
    pendingCourseIds?: number[];
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
}

export const CourseBrowser: React.FC<CourseBrowserProps> = ({
    courses,
    isLoading,
    isError,
    onRetry,
    selectedGrade,
    onGradeChange,
    searchTerm,
    onSearchChange,
    onEnroll,
    studentGradeLevel,
    pendingCourseIds = [],
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
}) => {
    const observerTarget = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!hasNextPage || isFetchingNextPage || !onLoadMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);

    return (
        <div className="space-y-6">
            <CourseFilters
                selectedGrade={selectedGrade}
                onGradeChange={onGradeChange}
                studentGradeLevel={studentGradeLevel}
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
            />

            {!isLoading && !isError && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-medium">{courses.length}</span> course
                        {courses.length !== 1 ? 's' : ''}
                        {selectedGrade && (
                            <span> for Grade {selectedGrade}</span>
                        )}
                    </p>
                </div>
            )}

            <CourseList
                courses={courses}
                isLoading={isLoading}
                isError={isError}
                onEnroll={onEnroll}
                onRetry={onRetry}
                pendingCourseIds={pendingCourseIds}
            />

            {/* Pagination Sentinel */}
            <div ref={observerTarget} className="h-4 w-full" />

            {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {!hasNextPage && courses.length > 0 && !isLoading && (
                <p className="text-center text-gray-500 text-sm py-8">
                    You've reached the end of the course catalog.
                </p>
            )}
        </div>
    );
};
