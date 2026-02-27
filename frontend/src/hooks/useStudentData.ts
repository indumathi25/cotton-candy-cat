import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getStudentProfile, getStudentSchedule, getStudentHistory, getGradeReport } from '../api/studentService';
import { StudentProfile, StudentSchedule, StudentCourseHistory, GradeReport } from '../types/student';

export const useStudentProfile = (id: number): UseQueryResult<StudentProfile, Error> => {
    return useQuery({
        queryKey: ['student', 'profile', id],
        queryFn: () => getStudentProfile(id),
    });
};

export const useStudentSchedule = (id: number): UseQueryResult<StudentSchedule, Error> => {
    return useQuery({
        queryKey: ['student', 'schedule', id],
        queryFn: () => getStudentSchedule(id),
    });
};

export const useStudentHistory = (id: number): UseQueryResult<StudentCourseHistory, Error> => {
    return useQuery({
        queryKey: ['student', 'history', id],
        queryFn: () => getStudentHistory(id),
    });
};

export const useGradeReport = (id: number): UseQueryResult<GradeReport, Error> => {
    return useQuery({
        queryKey: ['student', 'grades', id],
        queryFn: () => getGradeReport(id),
    });
};
