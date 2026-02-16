import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { StudentCourseHistory } from '../types/student';

interface StudentState {
    courseHistory: StudentCourseHistory | null;
}

const initialState: StudentState = {
    courseHistory: null,
};

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
});

export const { setCourseHistory, clearCourseHistory } = studentSlice.actions;

// Selectors
export const selectCourseHistory = (state: RootState) => state.student.courseHistory;
export const selectCompletedCourseIds = (state: RootState) =>
    state.student.courseHistory?.completedCourseIds || [];
export const selectActiveCourseIds = (state: RootState) =>
    state.student.courseHistory?.activeCourseIds || [];

export default studentSlice.reducer;
