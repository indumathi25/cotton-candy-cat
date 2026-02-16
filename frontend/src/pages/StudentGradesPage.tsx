import React from 'react';
import { StudentLayout } from '../components/layouts/StudentLayout';

export const StudentGradesPage: React.FC = () => {
    return (
        <StudentLayout title="My Grades">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Grade Report</h2>
                <p className="text-gray-600">Grades view coming soon...</p>
            </div>
        </StudentLayout>
    );
};
