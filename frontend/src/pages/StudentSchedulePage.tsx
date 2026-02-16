import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StudentLayout } from '../components/layouts/StudentLayout';
import { useAuth } from '../hooks/useAuth';
import { fetchStudentSchedule, selectStudentSchedule } from '../store/studentSlice';
import { AppDispatch } from '../store';
import { ScheduleItem } from '../types/student';
import { DAYS, TIME_SLOTS } from '../constants';

export const StudentSchedulePage: React.FC = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const scheduleData = useSelector(selectStudentSchedule);

    useEffect(() => {
        if (user?.studentId) {
            dispatch(fetchStudentSchedule(user.studentId));
        }
    }, [dispatch, user?.studentId]);

    const getScheduleItemsForSlot = (day: string, time: string): ScheduleItem[] => {
        if (!scheduleData?.schedule) return [];

        return scheduleData.schedule.filter(item => {
            if (item.dayOfWeek !== day) return false;
            // Check if this time slot falls within the course time
            const itemStart = item.startTime;
            const itemEnd = item.endTime;
            return time >= itemStart && time < itemEnd;
        });
    };

    if (!scheduleData) {
        return (
            <StudentLayout title="My Schedule">
                <div className="p-6">Loading schedule...</div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout title="My Schedule">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{scheduleData.semesterName} Schedule</h2>
                    <p className="text-sm text-gray-600 mt-1">{scheduleData.studentName}</p>
                </div>

                {/* Weekly Calendar Grid */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-24">
                                    Time
                                </th>
                                {DAYS.map(day => (
                                    <th key={day} className="border border-gray-300 bg-gray-50 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TIME_SLOTS.map(time => (
                                <tr key={time}>
                                    <td className="border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                                        {time}
                                    </td>
                                    {DAYS.map(day => {
                                        const items = getScheduleItemsForSlot(day, time);
                                        return (
                                            <td key={`${day}-${time}`} className="border border-gray-300 p-2 align-top">
                                                {items.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-indigo-100 border-l-4 border-indigo-500 p-2 mb-2 rounded"
                                                    >
                                                        <div className="font-semibold text-sm text-indigo-900">
                                                            {item.courseCode}
                                                        </div>
                                                        <div className="text-xs text-indigo-700">
                                                            {item.courseName}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-1">
                                                            {item.teacherName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Room {item.classroomId}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {item.startTime} - {item.endTime}
                                                        </div>
                                                    </div>
                                                ))}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Course List Summary */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrolled Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scheduleData.schedule.map((item, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                <div className="font-semibold text-gray-900">{item.courseCode} - {item.courseName}</div>
                                <div className="text-sm text-gray-600 mt-1">Instructor: {item.teacherName}</div>
                                <div className="text-sm text-gray-600">
                                    {item.dayOfWeek} {item.startTime} - {item.endTime}
                                </div>
                                <div className="text-sm text-gray-500">Room {item.classroomId}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};
