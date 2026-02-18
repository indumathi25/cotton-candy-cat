import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StudentLayout } from '../components/layouts/StudentLayout';
import { useAuth } from '../hooks/useAuth';
import { fetchStudentProfile, selectStudentProfile } from '../store/studentSlice';
import { AppDispatch } from '../store';
import { useStudentHistory } from '../hooks/useStudentData';

export const StudentProfilePage: React.FC = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(selectStudentProfile);
    const studentId = user?.studentId || 0;

    const { data: history, isLoading: historyLoading } = useStudentHistory(studentId);

    useEffect(() => {
        if (studentId) {
            dispatch(fetchStudentProfile(studentId));
        }
    }, [dispatch, studentId]);

    if (!profile || historyLoading) {
        return (
            <StudentLayout title="My Profile">
                <div className="p-6">Loading profile...</div>
            </StudentLayout>
        );
    }

    const completedEnrollments = history?.allEnrollments?.filter(
        e => e.status === 'passed' || e.status === 'failed'
    ) || [];

    return (
        <StudentLayout title="My Profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Personal Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Full Name</label>
                            <p className="mt-1 text-lg font-medium text-gray-900">{profile.fullName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Grade Level</label>
                            <p className="mt-1 text-lg text-gray-900">Grade {profile.gradeLevel}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Student ID</label>
                            <p className="mt-1 text-lg text-gray-900">{profile.id}</p>
                        </div>
                    </div>
                </div>

                {/* Academic Progress */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Academic Progress</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Cumulative GPA</label>
                            <p className="mt-1 text-3xl font-bold text-indigo-600">{profile.gpa.toFixed(2)}</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-medium text-gray-500">Credits Progress</label>
                                <span className="text-sm text-gray-600">{profile.creditsEarned} / {profile.creditsToGraduate}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(profile.progressPercentage, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{profile.remainingCredits} credits remaining to graduate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Completed Courses Section */}
            <div className="mt-8 bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Completed Courses (GPA Components)</h2>
                {completedEnrollments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {completedEnrollments.map((course) => (
                                    <tr key={course.courseId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                                            <div className="text-xs text-gray-500">{course.courseCode}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${course.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {course.grade || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                            {course.credits}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 capitalize">
                                            {course.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No completed courses found.</p>
                )}
            </div>
        </StudentLayout>
    );
};
