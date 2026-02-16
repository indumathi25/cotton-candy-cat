import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CourseBrowser } from '../components/features/courses/CourseBrowser';
import { StudentLayout } from '../components/layouts/StudentLayout';
import { selectUser } from '../store/authSlice';
import { selectCourseHistory, fetchCourseHistory } from '../store/studentSlice';
import { StudentCourseHistory } from '../types/student';
import { fetchCourseSections, enrollStudent } from '../store/coursesSlice';
import { AppDispatch } from '../store';
import { Modal } from '../components/common';


export const CoursesPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUser);
    const courseHistory = useSelector(selectCourseHistory);
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

    // Modal State
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    // Fetch course history on mount
    useEffect(() => {
        if (user?.studentId) {
            dispatch(fetchCourseHistory(user.studentId));
        }
    }, [dispatch, user?.studentId]);

    // Fallback to empty history if not loaded yet
    const studentCourseHistory: StudentCourseHistory = courseHistory || {
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
            // 1. Fetch sections for the course
            const fetchResultAction = await dispatch(fetchCourseSections(courseId));
            if (fetchCourseSections.rejected.match(fetchResultAction)) {
                throw new Error('Failed to fetch course sections. Please try again later.');
            }
            const fetchedSections = fetchResultAction.payload.sections;

            if (!fetchedSections || fetchedSections.length === 0) {
                setModalConfig({
                    isOpen: true,
                    title: 'No Sections Available',
                    message: 'There are currently no sections available for this course.',
                    type: 'error'
                });
                return;
            }

            // 2. Pick the first section (Logic from user request)
            const sectionId = fetchedSections[0].id;
            const sectionInfo = `Section ${sectionId} (${fetchedSections[0].dayOfWeek} ${fetchedSections[0].startTime})`;

            // 3. Enroll
            await dispatch(enrollStudent({ studentId: user.studentId, sectionId })).unwrap();

            // 4. Success: Show Modal and Refetch Schedule
            setModalConfig({
                isOpen: true,
                title: 'Enrollment Successful!',
                message: `You have successfully enrolled in ${sectionInfo}. Your schedule has been updated.`,
                type: 'success'
            });

            // Refetch schedule to update "Active/Enrolled" status on cards
            dispatch(fetchCourseHistory(user.studentId));

        } catch (err: any) {
            console.error("Enrollment failed", err);
            // 5. Failure: Show Error Modal
            setModalConfig({
                isOpen: true,
                title: 'Enrollment Failed',
                message: err || "An unexpected error occurred during enrollment.",
                type: 'error'
            });
        }
    };

    return (
        <StudentLayout
            title="Browse Courses"
        >
            <CourseBrowser
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                courseHistory={studentCourseHistory}
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
