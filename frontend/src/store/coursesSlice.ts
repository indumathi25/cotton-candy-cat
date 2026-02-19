import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

interface CoursesState {
    selectedGrade: number | null;
}

const initialState: CoursesState = {
    selectedGrade: null,
};

export const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setSelectedGrade: (state, action: PayloadAction<number | null>) => {
            state.selectedGrade = action.payload;
        },
    },
});

export const { setSelectedGrade } = coursesSlice.actions;

// Selectors
export const selectSelectedGrade = (state: RootState) => state.courses.selectedGrade;

export default coursesSlice.reducer;
