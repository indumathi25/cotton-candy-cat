import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import enrollmentReducer, {
    enrollStudent,
    dismissNotification,
    clearAllNotifications,
    resetStatus,
    selectEnrollmentStatus,
    selectEnrolledSectionIds,
    selectPendingSections,
    selectNotifications,
    selectIsSectionPending,
    selectIsSectionEnrolled,
} from './enrollmentSlice';

// ─── Mock API ─────────────────────────────────────────────────────────────────
vi.mock('../api/courseService', () => ({
    getCourseSections: vi.fn(),
    enrollInCourse: vi.fn(),
}));

import { getCourseSections, enrollInCourse } from '../api/courseService';
const mockGetCourseSections = vi.mocked(getCourseSections);
const mockEnrollInCourse = vi.mocked(enrollInCourse);

// ─── Store Helper ─────────────────────────────────────────────────────────────
const makeStore = () =>
    configureStore({ reducer: { enrollment: enrollmentReducer } });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('enrollmentSlice — reducer', () => {
    it('should return initial state', () => {
        const store = makeStore();
        expect(selectEnrollmentStatus(store.getState() as never)).toBe('idle');
        expect(selectEnrolledSectionIds(store.getState() as never)).toEqual([]);
        expect(selectNotifications(store.getState() as never)).toEqual([]);
    });

    it('dismissNotification should remove a specific notification by id', () => {
        const store = makeStore();

        // Seed a notification by dispatching a failed thunk
        store.dispatch({
            type: enrollStudent.rejected.type,
            payload: 'Some error',
            meta: { arg: { studentId: 1, courseId: 10 }, requestStatus: 'rejected' },
        });

        const notifications = selectNotifications(store.getState() as never);
        expect(notifications).toHaveLength(1);

        store.dispatch(dismissNotification(notifications[0].id));
        expect(selectNotifications(store.getState() as never)).toHaveLength(0);
    });

    it('clearAllNotifications should empty the queue', () => {
        const store = makeStore();

        // Add two notifications
        store.dispatch({
            type: enrollStudent.rejected.type,
            payload: 'Error 1',
            meta: { arg: { studentId: 1, courseId: 10 }, requestStatus: 'rejected' },
        });
        store.dispatch({
            type: enrollStudent.rejected.type,
            payload: 'Error 2',
            meta: { arg: { studentId: 1, courseId: 11 }, requestStatus: 'rejected' },
        });

        expect(selectNotifications(store.getState() as never)).toHaveLength(2);

        store.dispatch(clearAllNotifications());
        expect(selectNotifications(store.getState() as never)).toHaveLength(0);
    });

    it('resetStatus should reset status and error to idle', () => {
        const store = makeStore();

        store.dispatch({
            type: enrollStudent.rejected.type,
            payload: 'Some error',
            meta: { arg: { studentId: 1, courseId: 10 }, requestStatus: 'rejected' },
        });

        expect(selectEnrollmentStatus(store.getState() as never)).toBe('failed');

        store.dispatch(resetStatus());
        expect(selectEnrollmentStatus(store.getState() as never)).toBe('idle');
    });
});

describe('enrollmentSlice — enrollStudent thunk', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should set status to loading and add courseId to pendingSections', async () => {
        // Make fetch never resolve so we can observe the pending state
        mockGetCourseSections.mockReturnValue(new Promise(() => { }));

        const store = makeStore();
        store.dispatch(enrollStudent({ studentId: 1, courseId: 42 }));

        expect(selectEnrollmentStatus(store.getState() as never)).toBe('loading');
        expect(selectPendingSections(store.getState() as never)).toContain(42);
        expect(selectIsSectionPending(42)(store.getState() as never)).toBe(true);
    });

    it('✅ fulfilled: updates state correctly on successful enrollment', async () => {
        const mockSection = { id: 99, capacity: 30, timeSlot: { dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00' } } as never;
        mockGetCourseSections.mockResolvedValue([mockSection]);
        mockEnrollInCourse.mockResolvedValue({ success: true });

        const store = makeStore();
        await store.dispatch(enrollStudent({ studentId: 1, courseId: 42 }));

        const state = store.getState() as never;
        expect(selectEnrollmentStatus(state)).toBe('succeeded');
        expect(selectEnrolledSectionIds(state)).toContain(99);
        expect(selectPendingSections(state)).not.toContain(42);
        expect(selectIsSectionEnrolled(99)(state)).toBe(true);

        // Should push a success notification
        const notifications = selectNotifications(state);
        expect(notifications).toHaveLength(1);
        expect(notifications[0].type).toBe('success');
        expect(notifications[0].title).toBe('Enrollment Successful!');
    });

    it('❌ rejected: returns error when no sections available', async () => {
        mockGetCourseSections.mockResolvedValue([]);

        const store = makeStore();
        await store.dispatch(enrollStudent({ studentId: 1, courseId: 42 }));

        const state = store.getState() as never;
        expect(selectEnrollmentStatus(state)).toBe('failed');
        expect(selectPendingSections(state)).not.toContain(42);

        const notifications = selectNotifications(state);
        expect(notifications).toHaveLength(1);
        expect(notifications[0].type).toBe('error');
        expect(notifications[0].message).toContain('No sections are currently available');
    });

    it('❌ rejected: returns error when API call throws', async () => {
        const mockSection = { id: 99, capacity: 30, timeSlot: { dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00' } } as never;
        mockGetCourseSections.mockResolvedValue([mockSection]);
        mockEnrollInCourse.mockRejectedValue(new Error('Maximum course limit (5) reached'));

        const store = makeStore();
        await store.dispatch(enrollStudent({ studentId: 1, courseId: 42 }));

        const state = store.getState() as never;
        expect(selectEnrollmentStatus(state)).toBe('failed');

        const notifications = selectNotifications(state);
        expect(notifications[0].type).toBe('error');
        expect(notifications[0].message).toContain('Maximum course limit (5) reached');
    });

    it('should not duplicate sectionId in enrolledSectionIds on repeated enroll', async () => {
        const mockSection = { id: 99, capacity: 30, timeSlot: { dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00' } } as never;
        mockGetCourseSections.mockResolvedValue([mockSection]);
        mockEnrollInCourse.mockResolvedValue({ success: true });

        const store = makeStore();
        await store.dispatch(enrollStudent({ studentId: 1, courseId: 42 }));
        await store.dispatch(enrollStudent({ studentId: 1, courseId: 43 })); // different course, same section

        const enrolled = selectEnrolledSectionIds(store.getState() as never);
        expect(enrolled.filter((id: number) => id === 99)).toHaveLength(1);
    });
});
