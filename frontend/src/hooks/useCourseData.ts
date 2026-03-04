import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getCourses, getCourseSections, enrollInCourse, getCourseById } from '../api/courseService';

export const useCourses = (grade?: number, search?: string, size: number = 10) => {
    return useInfiniteQuery({
        queryKey: ['courses', grade, search, size],
        queryFn: ({ pageParam = 0 }) => getCourses(grade, search, pageParam, size),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.page + 1 >= lastPage.totalPages || lastPage.content.length === 0) return undefined;
            return lastPage.page + 1;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,    // 10 minutes (keep in memory longer)
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
