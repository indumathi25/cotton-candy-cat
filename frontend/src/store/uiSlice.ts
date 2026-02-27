import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';


interface UIState {
    courseFilter: {
        selectedGrade: number | null;
        searchTerm: string;
        currentPage: number;
        pageSize: number;
    };
}

const initialState: UIState = {
    courseFilter: {
        selectedGrade: null,
        searchTerm: '',
        currentPage: 0,
        pageSize: 20,
    },
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Course filter actions
        setSelectedGrade: (state, action: PayloadAction<number | null>) => {
            state.courseFilter.selectedGrade = action.payload;
            state.courseFilter.currentPage = 0; // reset to first page on filter change
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.courseFilter.searchTerm = action.payload;
            state.courseFilter.currentPage = 0;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.courseFilter.currentPage = action.payload;
        },
        resetCourseFilters: (state) => {
            state.courseFilter = initialState.courseFilter;
        },
    },
});

export const {
    setSelectedGrade,
    setSearchTerm,
    setCurrentPage,
    resetCourseFilters,
} = uiSlice.actions;

export const selectCourseFilter = (state: RootState) => state.ui.courseFilter;
export const selectSelectedGrade = (state: RootState) => state.ui.courseFilter.selectedGrade;
export const selectSearchTerm = (state: RootState) => state.ui.courseFilter.searchTerm;
export const selectCurrentPage = (state: RootState) => state.ui.courseFilter.currentPage;

export default uiSlice.reducer;
