import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

export type ScheduleViewMode = 'grid' | 'list';

interface UIState {
    courseFilter: {
        selectedGrade: number | null;
        searchTerm: string;
        currentPage: number;
        pageSize: number;
    };
    scheduleViewMode: ScheduleViewMode;
    sidebarOpen: boolean;
}

const initialState: UIState = {
    courseFilter: {
        selectedGrade: null,
        searchTerm: '',
        currentPage: 0,
        pageSize: 20,
    },
    scheduleViewMode: 'grid',
    sidebarOpen: false,
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

        // Schedule view
        setScheduleViewMode: (state, action: PayloadAction<ScheduleViewMode>) => {
            state.scheduleViewMode = action.payload;
        },

        // Sidebar
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
    },
});

export const {
    setSelectedGrade,
    setSearchTerm,
    setCurrentPage,
    resetCourseFilters,
    setScheduleViewMode,
    toggleSidebar,
    setSidebarOpen,
} = uiSlice.actions;

export const selectCourseFilter = (state: RootState) => state.ui.courseFilter;
export const selectSelectedGrade = (state: RootState) => state.ui.courseFilter.selectedGrade;
export const selectSearchTerm = (state: RootState) => state.ui.courseFilter.searchTerm;
export const selectCurrentPage = (state: RootState) => state.ui.courseFilter.currentPage;
export const selectScheduleViewMode = (state: RootState) => state.ui.scheduleViewMode;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;

export default uiSlice.reducer;
