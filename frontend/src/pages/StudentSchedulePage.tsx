import React from 'react';
import { StudentLayout } from '../components/layouts/StudentLayout';

export const StudentSchedulePage: React.FC = () => {
    return (
        <StudentLayout title="My Schedule">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Class Schedule</h2>
                <p className="text-gray-600">Schedule view coming soon...</p>
            </div>
        </StudentLayout>
    );
};
