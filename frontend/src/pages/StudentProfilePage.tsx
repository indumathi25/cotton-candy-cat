import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StudentLayout } from '../components/layouts/StudentLayout';
import { useAuth } from '../hooks/useAuth';
import { fetchStudentProfile, selectStudentProfile } from '../store/studentSlice';
import { AppDispatch } from '../store';

export const StudentProfilePage: React.FC = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(selectStudentProfile);

    useEffect(() => {
        if (user?.studentId) {
            dispatch(fetchStudentProfile(user.studentId));
        }
    }, [dispatch, user?.studentId]);

    if (!profile) {
        return (
            <StudentLayout title="My Profile">
                <div className="p-6">Loading profile...</div>
            </StudentLayout>
        );
    }

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
        </StudentLayout>
    );
};
