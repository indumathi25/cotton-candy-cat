import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export default coursesSlice.reducer;
