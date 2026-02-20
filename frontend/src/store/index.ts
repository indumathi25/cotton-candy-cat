import { configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import enrollmentReducer from './enrollmentSlice';
import uiReducer from './uiSlice';
import studentReducer from './studentSlice';

// ─── Root Reducer ─────────────────────────────────────────────────────────────
const rootReducer = combineReducers({
    auth: authReducer,       // Auth + credentials (persisted)
    enrollment: enrollmentReducer, // Enrollment status, pending sections, notifications (session-only)
    ui: uiReducer,           // Course filters, schedule view mode (session-only)
    student: studentReducer, // Student course history (session-only, re-fetched on mount)
});

// ─── Persist Config ───────────────────────────────────────────────────────────
// Only persist auth — enrollment & UI are session state, reset on refresh intentionally
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ─── Store ────────────────────────────────────────────────────────────────────
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist internal actions
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

// ─── Types ────────────────────────────────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
