import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { User, AuthState } from '../types/auth';

const initialState: AuthState = {
    user: null,
    credentials: null,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: User; credentials: { username: string; password: string } }>) => {
            state.user = action.payload.user;
            state.credentials = action.payload.credentials;
            state.isAuthenticated = true;
            // Redux Persist handles saving automatically
        },
        logout: (state) => {
            state.user = null;
            state.credentials = null;
            state.isAuthenticated = false;
            // Redux Persist handles clearing automatically
        },
    },
});

export const { setUser, logout: logoutAction } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCredentials = (state: RootState) => state.auth.credentials;

export default authSlice.reducer;
