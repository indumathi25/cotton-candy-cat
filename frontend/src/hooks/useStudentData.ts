import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getStudentProfile, getStudentSchedule, getCourses, getStudentHistory } from '../api/studentService';
import { StudentProfile, StudentSchedule, Course, PageResponse, StudentCourseHistory } from '../types/api';

export const useStudentProfile = (id: number): UseQueryResult<StudentProfile, Error> => {
    return useQuery({
        queryKey: ['studentProfile', id],
        queryFn: () => getStudentProfile(id),
        retry: 1,
    });
};

export const useStudentSchedule = (id: number): UseQueryResult<StudentSchedule, Error> => {
    return useQuery({
        queryKey: ['studentSchedule', id],
        queryFn: () => getStudentSchedule(id),
        retry: 1,
    });
};

export const useCourses = (
    grade?: number,
    page: number = 0,
    size: number = 20
): UseQueryResult<PageResponse<Course>, Error> => {
    return useQuery({
        queryKey: ['courses', grade, page, size],
        queryFn: () => getCourses(grade, page, size),
        retry: 1,
    });
};

export const useStudentHistory = (id: number): UseQueryResult<StudentCourseHistory, Error> => {
    return useQuery({
        queryKey: ['studentHistory', id],
        queryFn: () => getStudentHistory(id),
        retry: 1,
    });
};
