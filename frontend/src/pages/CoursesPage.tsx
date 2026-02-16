import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CourseBrowser } from '../components/features/courses/CourseBrowser';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { selectUser } from '../store/authSlice';
import { selectCourseHistory } from '../store/studentSlice';
import { StudentCourseHistory } from '../types/student';

export const CoursesPage: React.FC = () => {
    const user = useSelector(selectUser);
    const courseHistory = useSelector(selectCourseHistory);
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

    // Mock course history for demo (TODO: fetch from API)
    const mockCourseHistory: StudentCourseHistory = courseHistory || {
        completedCourseIds: [],
        activeCourseIds: [],
        allEnrollments: [],
    };

    const handleEnroll = (courseId: number) => {
        // TODO: Implement enrollment API call
        console.log('Enrolling in course:', courseId);
        alert(`Enrollment functionality coming soon! Course ID: ${courseId}`);
    };

    return (
        <DashboardLayout
            title="Browse Courses"
            welcomeMessage={`Find Your Next Course, ${user?.username}!`}
            subtitle="Explore available courses and build your schedule"
        >
            <CourseBrowser
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                courseHistory={mockCourseHistory}
                onEnroll={handleEnroll}
            />
        </DashboardLayout>
    );
};
