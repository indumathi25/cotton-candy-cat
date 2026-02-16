import React from 'react';
import { StudentLayout } from '../components/layouts/StudentLayout';
import { useAuth } from '../hooks/useAuth';

export const StudentProfilePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <StudentLayout title="My Profile">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Student Profile</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 text-lg text-gray-900">{user?.username || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <p className="mt-1 text-lg text-gray-900">{user?.role || 'N/A'}</p>
                    </div>
                    {/* Add more profile fields here */}
                </div>
            </div>
        </StudentLayout>
    );
};
