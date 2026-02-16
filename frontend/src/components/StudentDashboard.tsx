import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction, selectUser } from '../store/authSlice';
import { logout as logoutService } from '../api/authService';
import { useStudentProfile, useStudentSchedule } from '../hooks/useStudentData';

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const studentId = user?.studentId || 101;

    // Fetch data using React Query hooks
    const {
        data: profile,
        isLoading: profileLoading,
        isError: profileError,
        refetch: refetchProfile,
    } = useStudentProfile(studentId);

    const {
        data: schedule,
        isLoading: scheduleLoading,
        isError: scheduleError,
        refetch: refetchSchedule,
    } = useStudentSchedule(studentId);

    const handleLogout = () => {
        logoutService();
        dispatch(logoutAction());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Student Dashboard
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition focus:ring-4 focus:ring-red-300"
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Welcome back, {user?.username}!
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Here's your academic overview
                    </p>
                </div>

                {/* Profile Section */}
                <section aria-labelledby="profile-heading" className="mb-8">
                    <h3 id="profile-heading" className="sr-only">
                        Student Profile
                    </h3>
                    {profileLoading ? (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    ) : profileError ? (
                        <div
                            className="bg-red-50 border border-red-200 rounded-xl p-6"
                            role="alert"
                        >
                            <p className="text-red-700 mb-4">
                                Failed to load profile data
                            </p>
                            <button
                                onClick={() => refetchProfile()}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                                aria-label="Retry loading profile"
                            >
                                Retry
                            </button>
                        </div>
                    ) : profile ? (
                        <div className="bg-white rounded-xl shadow-md p-6">
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
                            <div className="mt-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Graduation Progress</span>
                                    <span>{profile.progressPercentage.toFixed(1)}%</span>
                                </div>
                                <div
                                    className="w-full bg-gray-200 rounded-full h-3"
                                    role="progressbar"
                                    aria-valuenow={profile.progressPercentage}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`Graduation progress: ${profile.progressPercentage.toFixed(1)}%`}
                                >
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${profile.progressPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {profile.remainingCredits} credits remaining
                                </p>
                            </div>
                        </div>
                    ) : null}
                </section>

                {/* Schedule Section */}
                <section aria-labelledby="schedule-heading">
                    <h3 id="schedule-heading" className="text-2xl font-bold text-gray-800 mb-4">
                        Current Semester Schedule
                    </h3>
                    {scheduleLoading ? (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="animate-pulse space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    ) : scheduleError ? (
                        <div
                            className="bg-red-50 border border-red-200 rounded-xl p-6"
                            role="alert"
                        >
                            <p className="text-red-700 mb-4">
                                Failed to load schedule
                            </p>
                            <button
                                onClick={() => refetchSchedule()}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                                aria-label="Retry loading schedule"
                            >
                                Retry
                            </button>
                        </div>
                    ) : schedule && schedule.schedule.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Semester: <span className="font-semibold">{schedule.semesterName}</span>
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full" role="table">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Course
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Teacher
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Day
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Time
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Room
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {schedule.schedule.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.courseName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {item.courseCode}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {item.teacherName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {item.dayOfWeek}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {item.startTime} - {item.endTime}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {item.classroomId}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                            <p className="text-yellow-700">
                                No courses enrolled for current semester
                            </p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default StudentDashboard;
