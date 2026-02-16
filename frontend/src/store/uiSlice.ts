import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface UIState {
    sidebarOpen: boolean;
    theme: Theme;
    notifications: boolean;
}

const initialState: UIState = {
    sidebarOpen: true,
    theme: 'light',
    notifications: true,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setNotifications: (state, action: PayloadAction<boolean>) => {
            state.notifications = action.payload;
        },
    },
});

export const { toggleSidebar, setSidebarOpen, setTheme, toggleTheme, setNotifications } = uiSlice.actions;
export default uiSlice.reducer;

// Selectors
export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebarOpen;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
