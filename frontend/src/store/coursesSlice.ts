import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { Course, CourseWithEnrollmentStatus } from '../types/course';

interface CoursesState {
    availableCourses: CourseWithEnrollmentStatus[];
    selectedGrade: number | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: CoursesState = {
    availableCourses: [],
    selectedGrade: null,
    isLoading: false,
    error: null,
};

export const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setAvailableCourses: (state, action: PayloadAction<CourseWithEnrollmentStatus[]>) => {
            state.availableCourses = action.payload;
        },
        setSelectedGrade: (state, action: PayloadAction<number | null>) => {
            state.selectedGrade = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearCourses: (state) => {
            state.availableCourses = [];
            state.error = null;
        },
    },
});

export const { setAvailableCourses, setSelectedGrade, setLoading, setError, clearCourses } = coursesSlice.actions;

// Selectors
export const selectAvailableCourses = (state: RootState) => state.courses.availableCourses;
export const selectSelectedGrade = (state: RootState) => state.courses.selectedGrade;
export const selectCoursesLoading = (state: RootState) => state.courses.isLoading;
export const selectCoursesError = (state: RootState) => state.courses.error;

export default coursesSlice.reducer;
