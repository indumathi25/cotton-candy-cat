import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCourses } from '../api/coursesService';
import { Course } from '../types/course';
import { PageResponse } from '../types/api';

export const useCourses = (grade?: number, page: number = 0, size: number = 20): UseQueryResult<PageResponse<Course>, Error> => {
    return useQuery({
        queryKey: ['courses', grade, page, size],
        queryFn: () => getCourses(grade, page, size),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
