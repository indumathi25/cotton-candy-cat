import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { Course, CourseWithEnrollmentStatus } from '../types/course';
import { CourseSection } from '../types/student';
import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

interface CoursesState {
    availableCourses: CourseWithEnrollmentStatus[];
    selectedGrade: number | null;
    isLoading: boolean;
    error: string | null;
    sections: { [courseId: number]: CourseSection[] };
    sectionsLoading: { [courseId: number]: boolean };
    enrollmentLoading: boolean;
    enrollmentError: string | null;
    enrollmentSuccess: string | null;
}

const initialState: CoursesState = {
    availableCourses: [],
    selectedGrade: null,
    isLoading: false,
    error: null,
    sections: {},
    sectionsLoading: {},
    enrollmentLoading: false,
    enrollmentError: null,
    enrollmentSuccess: null,
};

export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async (gradeLevel: number | null = null) => {
        const url = gradeLevel
            ? `${API_ENDPOINTS.COURSES}?grade=${gradeLevel}`
            : API_ENDPOINTS.COURSES;
        const response = await axios.get(url);
        return response.data.content;
    }
);

export const fetchCourseSections = createAsyncThunk(
    'courses/fetchCourseSections',
    async (courseId: number, { getState }) => {
        const state = getState() as RootState;
        const { credentials } = state.auth;

        let config = {};
        if (credentials) {
            config = {
                auth: {
                    username: credentials.username,
                    password: credentials.password
                }
            };
        }

        const response = await axios.get(`${API_ENDPOINTS.COURSES}/${courseId}/sections`, config);
        return { courseId, sections: response.data };
    }
);

export const enrollStudent = createAsyncThunk(
    'courses/enrollStudent',
    async ({ studentId, sectionId }: { studentId: number; sectionId: number }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { credentials } = state.auth;

        let config = {};
        if (credentials) {
            config = {
                auth: {
                    username: credentials.username,
                    password: credentials.password
                }
            };
        }

        try {
            const response = await axios.post(API_ENDPOINTS.ENROLL, {
                studentId,
                courseSectionId: sectionId,
            }, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Enrollment failed');
        }
    }
);

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
        clearEnrollmentStatus: (state) => {
            state.enrollmentError = null;
            state.enrollmentSuccess = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.availableCourses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch courses';
            })
            // Fetch Sections
            .addCase(fetchCourseSections.pending, (state, action) => {
                state.sectionsLoading[action.meta.arg] = true;
            })
            .addCase(fetchCourseSections.fulfilled, (state, action) => {
                state.sectionsLoading[action.payload.courseId] = false;
                state.sections[action.payload.courseId] = action.payload.sections;
            })
            .addCase(fetchCourseSections.rejected, (state, action) => {
                state.sectionsLoading[action.meta.arg] = false;
            })
            // Enroll Student
            .addCase(enrollStudent.pending, (state) => {
                state.enrollmentLoading = true;
                state.enrollmentError = null;
                state.enrollmentSuccess = null;
            })
            .addCase(enrollStudent.fulfilled, (state) => {
                state.enrollmentLoading = false;
                state.enrollmentSuccess = "Successfully enrolled!";
            })
            .addCase(enrollStudent.rejected, (state, action) => {
                state.enrollmentLoading = false;
                state.enrollmentError = action.payload as string;
            });
    },
});

export const { setAvailableCourses, setSelectedGrade, setLoading, setError, clearCourses, clearEnrollmentStatus } = coursesSlice.actions;

// Selectors
export const selectAvailableCourses = (state: RootState) => state.courses.availableCourses;
export const selectSelectedGrade = (state: RootState) => state.courses.selectedGrade;
export const selectCoursesLoading = (state: RootState) => state.courses.isLoading;
export const selectCoursesError = (state: RootState) => state.courses.error;
export const selectCourseSections = (courseId: number) => (state: RootState) => state.courses.sections[courseId] || [];
export const selectSectionsLoading = (courseId: number) => (state: RootState) => !!state.courses.sectionsLoading[courseId];
export const selectEnrollmentLoading = (state: RootState) => state.courses.enrollmentLoading;
export const selectEnrollmentError = (state: RootState) => state.courses.enrollmentError;
export const selectEnrollmentSuccess = (state: RootState) => state.courses.enrollmentSuccess;

export default coursesSlice.reducer;
