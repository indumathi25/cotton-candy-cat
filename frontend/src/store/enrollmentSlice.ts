import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { enrollInCourse, getCourseSections } from '../api/courseService';

export type EnrollmentStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface EnrollmentNotification {
    id: string;
    type: 'success' | 'error';
    title: string;
    message: string;
    timestamp: number;
}

interface EnrollmentState {
    // Track which sections are currently being enrolled in (prevents double-click)
    pendingSections: number[];

    // Track successfully enrolled section IDs this session (optimistic UI)
    enrolledSectionIds: number[];

    // Global enrollment status for the latest operation
    status: EnrollmentStatus;
    error: string | null;

    // Toast-style notifications queue
    notifications: EnrollmentNotification[];
}

const initialState: EnrollmentState = {
    pendingSections: [],
    enrolledSectionIds: [],
    status: 'idle',
    error: null,
    notifications: [],
};

export const enrollStudent = createAsyncThunk(
    'enrollment/enroll',
    async ({ studentId, courseId }: { studentId: number; courseId: number }, { rejectWithValue }) => {
        try {
            // Step 1: Fetch sections for this course
            const sections = await getCourseSections(courseId);

            if (!sections || sections.length === 0) {
                return rejectWithValue('No sections are currently available for this course.');
            }

            // Step 2: Pick the first available section
            const section = sections[0];

            // Step 3: Enroll
            await enrollInCourse(studentId, section.id);

            return { sectionId: section.id, courseId };
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Enrollment failed. Please try again.';
            return rejectWithValue(message);
        }
    },
    {
        condition: ({ courseId }, { getState }) => {
            const { enrollment } = getState() as RootState;
            // Bail if this course is already pending or if we already have it enrolled
            if (enrollment.pendingSections.includes(courseId)) {
                return false;
            }
            if (enrollment.enrolledSectionIds.includes(courseId)) {
                return false;
            }
            return true;
        },
    }
);


export const enrollmentSlice = createSlice({
    name: 'enrollment',
    initialState,
    reducers: {
        dismissNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
        },
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(enrollStudent.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
                // Track by courseId during pending (we don't have sectionId yet)
                state.pendingSections.push(action.meta.arg.courseId);
            })

            .addCase(enrollStudent.fulfilled, (state, action) => {
                const { sectionId, courseId } = action.payload;
                state.status = 'succeeded';
                // Remove courseId from pending (was added in pending handler)
                state.pendingSections = state.pendingSections.filter(id => id !== courseId);
                if (!state.enrolledSectionIds.includes(sectionId)) {
                    state.enrolledSectionIds.push(sectionId);
                }
                const message = `Successfully enrolled! Your schedule has been updated.`;
                // Shows only one notification at a time
                const isDuplicate = state.notifications.some(n => n.message === message && n.type === 'success');
                if (!isDuplicate) {
                    state.notifications.push({
                        id: `enroll-success-${Date.now()}`,
                        type: 'success',
                        title: 'Enrollment Successful!',
                        message,
                        timestamp: Date.now(),
                    });
                }
            })

            .addCase(enrollStudent.rejected, (state, action) => {
                const courseId = action.meta.arg.courseId;
                state.status = 'failed';
                state.error = action.payload as string;
                state.pendingSections = state.pendingSections.filter(id => id !== courseId);
                const message = action.payload as string;
                const isDuplicate = state.notifications.some(n => n.message === message && n.type === 'error');
                if (!isDuplicate) {
                    state.notifications.push({
                        id: `enroll-error-${Date.now()}`,
                        type: 'error',
                        title: 'Enrollment Failed',
                        message,
                        timestamp: Date.now(),
                    });
                }
            });
    },
});

export const { dismissNotification, clearAllNotifications, resetStatus } = enrollmentSlice.actions;

export const selectEnrollmentStatus = (state: RootState) => state.enrollment.status;
export const selectEnrollmentError = (state: RootState) => state.enrollment.error;
export const selectPendingSections = (state: RootState) => state.enrollment.pendingSections;
export const selectEnrolledSectionIds = (state: RootState) => state.enrollment.enrolledSectionIds;
export const selectNotifications = (state: RootState) => state.enrollment.notifications;

/** Returns true if a specific section is currently being enrolled in */
export const selectIsSectionPending = (sectionId: number) =>
    (state: RootState) => state.enrollment.pendingSections.includes(sectionId);

/** Returns true if a specific section was already enrolled this session */
export const selectIsSectionEnrolled = (sectionId: number) =>
    (state: RootState) => state.enrollment.enrolledSectionIds.includes(sectionId);

export default enrollmentSlice.reducer;
