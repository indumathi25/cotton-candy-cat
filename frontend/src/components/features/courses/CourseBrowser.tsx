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
    onEnroll: (courseId: number) => void;
    studentGradeLevel: number;
    pendingCourseIds?: number[];
}

export const CourseBrowser: React.FC<CourseBrowserProps> = ({
    courses,
    isLoading,
    isError,
    onRetry,
    selectedGrade,
    onGradeChange,
    onEnroll,
    studentGradeLevel,
    pendingCourseIds = [],
}) => {
    return (
        <div className="space-y-6">
            <CourseFilters
                selectedGrade={selectedGrade}
                onGradeChange={onGradeChange}
                studentGradeLevel={studentGradeLevel}
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
        </div>
    );
};
