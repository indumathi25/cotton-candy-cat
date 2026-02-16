import React from 'react';
import { Card } from '../../common';
import { StudentSchedule } from '../../../types/api';

interface ScheduleTableProps {
    schedule: StudentSchedule;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule }) => {
    if (!schedule || schedule.schedule.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <p className="text-yellow-700">
                    No courses enrolled for current semester
                </p>
            </div>
        );
    }

    return (
        <Card noPadding>
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
        </Card>
    );
};
