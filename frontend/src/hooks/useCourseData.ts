import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { getCourses, getCourseSections, enrollInCourse, getCourseById } from '../api/courseService';
import { Course } from '../types/course';
import { PageResponse } from '../types/api';

export const useCourses = (grade?: number, page: number = 0, size: number = 20): UseQueryResult<PageResponse<Course>, Error> => {
    return useQuery({
        queryKey: ['courses', grade, page, size],
        queryFn: () => getCourses(grade, page, size),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCourse = (courseId: number) => {
    return useQuery({
        queryKey: ['courses', courseId],
        queryFn: () => getCourseById(courseId),
        enabled: !!courseId,
    });
};

export const useCourseSections = (courseId: number) => {
    return useQuery({
        queryKey: ['courses', courseId, 'sections'],
        queryFn: () => getCourseSections(courseId),
        enabled: !!courseId,
    });
};

export const useEnrollment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentId, sectionId }: { studentId: number; sectionId: number }) =>
            enrollInCourse(studentId, sectionId),
        onSuccess: (_, variables) => {
            // Invalidate relevant queries to refresh the UI
            queryClient.invalidateQueries({ queryKey: ['student', 'schedule', variables.studentId] });
            queryClient.invalidateQueries({ queryKey: ['student', 'profile', variables.studentId] });
            queryClient.invalidateQueries({ queryKey: ['student', 'history', variables.studentId] });
        },
    });
};
