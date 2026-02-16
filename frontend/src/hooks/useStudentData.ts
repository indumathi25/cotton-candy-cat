import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getStudentProfile, getStudentSchedule, getCourses } from '../api/studentService';
import { StudentProfile, StudentSchedule, Course, PageResponse } from '../types/api';

export const useStudentProfile = (id: number): UseQueryResult<StudentProfile, Error> => {
    return useQuery({
        queryKey: ['studentProfile', id],
        queryFn: () => getStudentProfile(id),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};

export const useStudentSchedule = (id: number): UseQueryResult<StudentSchedule, Error> => {
    return useQuery({
        queryKey: ['studentSchedule', id],
        queryFn: () => getStudentSchedule(id),
        staleTime: 5 * 60 * 1000,
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
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
    });
};
