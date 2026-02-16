import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { StudentCourseHistory, StudentProfile, StudentSchedule, GradeReport } from '../types/student';
import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

interface StudentState {
    courseHistory: StudentCourseHistory | null;
    profile: StudentProfile | null;
    schedule: StudentSchedule | null;
    gradeReport: GradeReport | null;
    loading: boolean;
    error: string | null;
}

const initialState: StudentState = {
    courseHistory: null,
    profile: null,
    schedule: null,
    gradeReport: null,
    loading: false,
    error: null,
};

export const fetchStudentProfile = createAsyncThunk(
    'student/fetchStudentProfile',
    async (studentId: number, { getState }) => {
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

        const response = await axios.get(`${API_ENDPOINTS.STUDENTS}/${studentId}`, config);
        return response.data;
    }
);

export const fetchCourseHistory = createAsyncThunk(
    'student/fetchCourseHistory',
    async (studentId: number, { getState }) => {
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

        const response = await axios.get(`${API_ENDPOINTS.STUDENTS}/${studentId}/history`, config);
        return response.data;
    }
);

export const fetchStudentSchedule = createAsyncThunk(
    'student/fetchStudentSchedule',
    async (studentId: number, { getState }) => {
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

        const response = await axios.get(`${API_ENDPOINTS.STUDENTS}/${studentId}/schedule`, config);
        return response.data;
    }
);

export const fetchGradeReport = createAsyncThunk(
    'student/fetchGradeReport',
    async (studentId: number, { getState }) => {
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

        const response = await axios.get(`${API_ENDPOINTS.STUDENTS}/${studentId}/grades`, config);
        return response.data;
    }
);

export const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setCourseHistory: (state, action: PayloadAction<StudentCourseHistory>) => {
            state.courseHistory = action.payload;
        },
        clearCourseHistory: (state) => {
            state.courseHistory = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourseHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.courseHistory = action.payload;
            })
            .addCase(fetchCourseHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch course history';
            })
            // Fetch Profile
            .addCase(fetchStudentProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStudentProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchStudentProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch student profile';
            })
            // Fetch Schedule
            .addCase(fetchStudentSchedule.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStudentSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.schedule = action.payload;
            })
            .addCase(fetchStudentSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch student schedule';
            })
            // Fetch Grade Report
            .addCase(fetchGradeReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGradeReport.fulfilled, (state, action) => {
                state.loading = false;
                state.gradeReport = action.payload;
            })
            .addCase(fetchGradeReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch grade report';
            });
    },
});

export const { setCourseHistory, clearCourseHistory } = studentSlice.actions;

// Selectors
export const selectStudentProfile = (state: RootState) => state.student.profile;
export const selectCourseHistory = (state: RootState) => state.student.courseHistory;
export const selectStudentSchedule = (state: RootState) => state.student.schedule;
export const selectGradeReport = (state: RootState) => state.student.gradeReport;
export const selectCompletedCourseIds = (state: RootState) =>
    state.student.courseHistory?.completedCourseIds || [];
export const selectActiveCourseIds = (state: RootState) =>
    state.student.courseHistory?.activeCourseIds || [];

export default studentSlice.reducer;
