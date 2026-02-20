import React from 'react';
import { useCourses } from '../../../hooks/useCourseData';
import { CourseFilters } from './CourseFilters';
import { CourseList } from './CourseList';
import { enrichCoursesWithEnrollmentStatus } from '../../../utils/enrollmentValidation';
import { StudentCourseHistory } from '../../../types/student';

interface CourseBrowserProps {
    selectedGrade: number | null;
    onGradeChange: (grade: number | null) => void;
    courseHistory: StudentCourseHistory;
    onEnroll: (courseId: number) => void;
    studentGradeLevel: number;
    isEnrolling?: boolean;
}

export const CourseBrowser: React.FC<CourseBrowserProps> = ({
    selectedGrade,
    onGradeChange,
    courseHistory,
    onEnroll,
    studentGradeLevel,
    isEnrolling = false,
}) => {

    const {
        data: coursesResponse,
        isLoading,
        isError,
        refetch,
    } = useCourses(selectedGrade || undefined, 0, 50);

    const enrichedCourses = coursesResponse?.content
        ? enrichCoursesWithEnrollmentStatus(
            coursesResponse.content,
            studentGradeLevel,
            courseHistory
        )
        : [];

    return (
        <div className="space-y-6">
            {/* Filters */}
            <CourseFilters
                selectedGrade={selectedGrade}
                onGradeChange={onGradeChange}
                studentGradeLevel={studentGradeLevel}
            />

            {/* Course Count */}
            {!isLoading && !isError && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-medium">{enrichedCourses.length}</span> course
                        {enrichedCourses.length !== 1 ? 's' : ''}
                        {selectedGrade && (
                            <span> for Grade {selectedGrade}</span>
                        )}
                    </p>
                </div>
            )}

            {/* Course List */}
            <CourseList
                courses={enrichedCourses}
                isLoading={isLoading}
                isError={isError}
                onEnroll={onEnroll}
                onRetry={refetch}
                isEnrolling={isEnrolling}
            />
        </div>
    );
};
