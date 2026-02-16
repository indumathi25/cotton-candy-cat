import React from 'react';
import { CourseWithEnrollmentStatus } from '../../../types/course';
import { Card, Button } from '../../common';
import { getEnrollmentBlockMessage } from '../../../utils/enrollmentValidation';

interface CourseCardProps {
    course: CourseWithEnrollmentStatus;
    onEnroll: (courseId: number) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
    const handleEnroll = () => {
        if (course.canEnroll) {
            onEnroll(course.id);
        }
    };

    const blockMessage = course.enrollmentBlockReason
        ? getEnrollmentBlockMessage(course.enrollmentBlockReason, course.prerequisiteCourseName)
        : '';

    return (
        <Card className="h-full flex flex-col">
            <div className="flex-1">
                {/* Course Header */}
                <div className="mb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{course.code}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {course.credits} {course.credits === 1 ? 'Credit' : 'Credits'}
                        </span>
                    </div>
                </div>

                {/* Course Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">📚 Grade Level:</span>
                        <span>
                            {course.gradeLevelMin === course.gradeLevelMax
                                ? `Grade ${course.gradeLevelMin}`
                                : `Grades ${course.gradeLevelMin}-${course.gradeLevelMax}`}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">⏰ Hours/Week:</span>
                        <span>{course.hoursPerWeek}</span>
                    </div>
                    {course.prerequisiteCourseName && (
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium mr-2">📋 Prerequisite:</span>
                            <span>{course.prerequisiteCourseName}</span>
                        </div>
                    )}
                </div>

                {/* Course Description */}
                {course.description && (
                    <p className="text-sm text-gray-700 line-clamp-3">{course.description}</p>
                )}

                {/* Block Message */}
                {!course.canEnroll && blockMessage && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            <span className="font-medium">⚠️ Cannot enroll: </span>
                            {blockMessage}
                        </p>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                    variant={course.canEnroll ? 'primary' : 'secondary'}
                    fullWidth
                    onClick={handleEnroll}
                    disabled={!course.canEnroll}
                    aria-label={course.canEnroll ? `Enroll in ${course.name}` : `Cannot enroll in ${course.name}`}
                >
                    {course.canEnroll ? '➕ Add Course' : '🔒 Cannot Enroll'}
                </Button>
            </div>
        </Card>
    );
};
