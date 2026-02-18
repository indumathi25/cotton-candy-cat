import React from 'react';
import { Card, ProgressBar } from '../../common';
import { StudentProfile, StudentCourseHistory } from '../../../types/api';

interface ProfileCardProps {
    profile: StudentProfile;
    history?: StudentCourseHistory;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, history }) => {
    const completedEnrollments = history?.allEnrollments?.filter(
        e => e.status === 'passed' || e.status === 'failed'
    ) || [];

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Student Info */}
                <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {profile.fullName}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Grade Level</p>
                    <p className="text-lg font-semibold text-gray-900">
                        Grade {profile.gradeLevel}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">GPA</p>
                    <p className="text-lg font-semibold text-blue-600">
                        {profile.gpa.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Credits Earned</p>
                    <p className="text-lg font-semibold text-green-600">
                        {profile.creditsEarned} / {profile.creditsToGraduate}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar
                value={profile.progressPercentage}
                label="Graduation Progress"
                className="mt-6"
            />
            <p className="text-sm text-gray-600 mt-2">
                {profile.remainingCredits} credits remaining
            </p>

            {/* Completed Courses Section */}
            {completedEnrollments.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="text-md font-bold text-gray-800 mb-3">Completed Courses (GPA Components)</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {completedEnrollments.map((course) => (
                                    <tr key={course.courseId}>
                                        <td className="px-4 py-2">
                                            <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                                            <div className="text-xs text-gray-500">{course.courseCode}</div>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {course.grade || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <span className="text-sm text-gray-500">{course.credits}</span>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <span className="text-xs text-gray-500 capitalize">{course.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Card>
    );
};
