import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CourseBrowser } from '../components/features/courses/CourseBrowser';
import { StudentLayout } from '../components/layouts/StudentLayout';
import { selectUser } from '../store/authSlice';
import { Modal } from '../components/common';
import { useStudentHistory } from '../hooks/useStudentData';
import { useCourseSections, useEnrollment } from '../hooks/useCourseData';
import { getCourseSections } from '../api/courseService';
import { StudentCourseHistory } from '../types/api';

export const CoursesPage: React.FC = () => {
    const user = useSelector(selectUser);
    const studentId = user?.studentId || 101;

    const { data: history } = useStudentHistory(studentId);
    const { mutateAsync: enrollInSection } = useEnrollment();
    const { refetch: fetchSections } = useCourseSections(0); // This is generic

    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

    // Modal State
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    // Fallback to empty history if not loaded yet
    const studentCourseHistory: StudentCourseHistory = history || {
        completedCourseIds: [],
        activeCourseIds: [],
        allEnrollments: [],
    };

    const handleEnroll = async (courseId: number) => {
        if (!user?.studentId) {
            setModalConfig({
                isOpen: true,
                title: 'Authentication Error',
                message: 'Student ID not found. Please re-login.',
                type: 'error'
            });
            return;
        }

        try {
            // 1. Fetch sections specifically for this course using the service
            const sections = await getCourseSections(courseId);

            if (!sections || sections.length === 0) {
                setModalConfig({
                    isOpen: true,
                    title: 'No Sections Available',
                    message: 'There are currently no sections available for this course.',
                    type: 'error'
                });
                return;
            }

            // 2. Pick the first section and handle potential missing data
            const section = sections[0];
            const sectionInfo = section.timeSlot
                ? `Section ${section.id} (${section.timeSlot.dayOfWeek} ${section.timeSlot.startTime})`
                : `Section ${section.id}`;

            // 3. Enroll
            await enrollInSection({ studentId: user.studentId, sectionId: section.id });

            // 4. Success: Show Modal
            setModalConfig({
                isOpen: true,
                title: 'Enrollment Successful!',
                message: `You have successfully enrolled in ${sectionInfo}. Your schedule has been updated.`,
                type: 'success'
            });

        } catch (err: any) {
            console.error("Enrollment failed", err);
            setModalConfig({
                isOpen: true,
                title: 'Enrollment Failed',
                message: err.message || "An unexpected error occurred during enrollment.",
                type: 'error'
            });
        }
    };

    return (
        <StudentLayout title="Browse Courses">
            <CourseBrowser
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                courseHistory={studentCourseHistory as any}
                onEnroll={handleEnroll}
            />

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                variant={modalConfig.type}
            >
                <p className={modalConfig.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                    {modalConfig.message}
                </p>
            </Modal>
        </StudentLayout>
    );
};
