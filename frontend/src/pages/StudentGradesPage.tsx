import React from 'react';
import { useSelector } from 'react-redux';
import { StudentLayout } from '../components/layouts/StudentLayout';
import { selectUser } from '../store/authSlice';
import { useGradeReport } from '../hooks/useStudentData';
import { GRADE_COLORS, ACADEMIC_STANDING } from '../constants/ui';
import { CourseGrade } from '../types/api';

export const StudentGradesPage: React.FC = () => {
    const user = useSelector(selectUser);
    const studentId = user?.studentId || 101;

    const { data: gradeReport, isPending, isError } = useGradeReport(studentId);

    if (isPending) {
        return (
            <StudentLayout title="My Grades">
                <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-gray-600">Loading grades...</p>
                </div>
            </StudentLayout>
        );
    }

    if (isError || !gradeReport) {
        return (
            <StudentLayout title="My Grades">
                <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-red-600">Failed to load grade report.</p>
                </div>
            </StudentLayout>
        );
    }

    const getGradeColor = (grade: string | null) => {
        if (!grade) return 'text-gray-500';
        return GRADE_COLORS[grade.toUpperCase()] || 'text-gray-500';
    };

    const standing = ACADEMIC_STANDING.find(s => (gradeReport?.overallGpa || 0) >= s.minGpa) || ACADEMIC_STANDING[ACADEMIC_STANDING.length - 1];

    return (
        <StudentLayout title="My Grades">
            {/* GPA Summary Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-blue-100 text-sm">Overall GPA</p>
                        <p className="text-4xl font-bold">{gradeReport.overallGpa.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm">Credits Earned</p>
                        <p className="text-4xl font-bold">
                            {gradeReport.totalCreditsEarned} / {gradeReport.totalCreditsAttempted}
                        </p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm">Academic Standing</p>
                        <p className="text-2xl font-semibold mt-2">{standing.text}</p>
                    </div>
                </div>
            </div>

            {/* Course Grades */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Course Grades</h2>

                {gradeReport.courseGrades.length === 0 ? (
                    <p className="text-gray-600">No grades available yet.</p>
                ) : (
                    <div className="space-y-4">
                        {gradeReport.courseGrades.map((courseGrade: CourseGrade) => (
                            <div
                                key={courseGrade.enrollmentId}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">
                                            {courseGrade.courseCode} - {courseGrade.courseName}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {courseGrade.teacherName} | {courseGrade.semester}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-sm text-gray-500">
                                                Credits: {courseGrade.credits}
                                            </span>
                                            <span className={`text-sm px-2 py-1 rounded ${courseGrade.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {courseGrade.status === 'completed' ? 'Completed' : 'In Progress'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 mb-1">Grade</p>
                                        <p className={`text-3xl ${getGradeColor(courseGrade.grade)}`}>
                                            {courseGrade.grade || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};
