import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { getStudentHistory } from '../api/studentService';
import { StudentCourseHistory } from '../types/student';

// ─── State ────────────────────────────────────────────────────────────────────

type HistoryStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface StudentState {
    history: StudentCourseHistory | null;
    historyStatus: HistoryStatus;
    historyError: string | null;
}

const initialState: StudentState = {
    history: null,
    historyStatus: 'idle',
    historyError: null,
};

// ─── Async Thunk ──────────────────────────────────────────────────────────────

export const fetchStudentHistory = createAsyncThunk(
    'student/fetchHistory',
    async (studentId: number, { rejectWithValue }) => {
        try {
            return await getStudentHistory(studentId);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Failed to load course history.';
            return rejectWithValue(message);
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

export const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentHistory.pending, (state) => {
                state.historyStatus = 'loading';
                state.historyError = null;
            })
            .addCase(fetchStudentHistory.fulfilled, (state, action) => {
                state.historyStatus = 'succeeded';
                state.history = action.payload;
            })
            .addCase(fetchStudentHistory.rejected, (state, action) => {
                state.historyStatus = 'failed';
                state.historyError = action.payload as string;
            });
    },
});

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectStudentHistory = (state: RootState): StudentCourseHistory =>
    state.student.history ?? { completedCourseIds: [], activeCourseIds: [], allEnrollments: [] };

export const selectHistoryStatus = (state: RootState): HistoryStatus =>
    state.student.historyStatus;

export const selectHistoryError = (state: RootState): string | null =>
    state.student.historyError;

export default studentSlice.reducer;
