import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import studentReducer, {
    fetchStudentHistory,
    selectStudentHistory,
    selectHistoryStatus,
    selectHistoryError,
} from './studentSlice';

// ─── Mock API ─────────────────────────────────────────────────────────────────
vi.mock('../api/studentService', () => ({
    getStudentHistory: vi.fn(),
    getStudentProfile: vi.fn(),
    getStudentSchedule: vi.fn(),
    getGradeReport: vi.fn(),
}));

import { getStudentHistory } from '../api/studentService';
const mockGetStudentHistory = vi.mocked(getStudentHistory);

// ─── Store Helper ─────────────────────────────────────────────────────────────
const makeStore = () =>
    configureStore({ reducer: { student: studentReducer } });

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const mockHistory = {
    completedCourseIds: [1, 2],
    activeCourseIds: [3],
    allEnrollments: [
        {
            courseId: 3,
            courseName: 'Algebra 1',
            courseCode: 'MATH101',
            semesterOrder: 1,
            credits: 3,
            status: 'active' as const,
        },
    ],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('studentSlice — initial state', () => {
    it('should return correct initial state', () => {
        const store = makeStore();
        const state = store.getState() as never;
        expect(selectHistoryStatus(state)).toBe('idle');
        expect(selectHistoryError(state)).toBeNull();
        // selector returns safe empty default when history is null
        expect(selectStudentHistory(state)).toEqual({
            completedCourseIds: [],
            activeCourseIds: [],
            allEnrollments: [],
        });
    });
});

describe('studentSlice — fetchStudentHistory thunk', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('⏳ pending: sets historyStatus to loading', () => {
        mockGetStudentHistory.mockReturnValue(new Promise(() => { }));

        const store = makeStore();
        store.dispatch(fetchStudentHistory(101));

        const state = store.getState() as never;
        expect(selectHistoryStatus(state)).toBe('loading');
        expect(selectHistoryError(state)).toBeNull();
    });

    it('✅ fulfilled: populates history and sets status to succeeded', async () => {
        mockGetStudentHistory.mockResolvedValue(mockHistory);

        const store = makeStore();
        await store.dispatch(fetchStudentHistory(101));

        const state = store.getState() as never;
        expect(selectHistoryStatus(state)).toBe('succeeded');
        expect(selectStudentHistory(state)).toEqual(mockHistory);
        expect(selectStudentHistory(state).completedCourseIds).toContain(1);
        expect(selectStudentHistory(state).activeCourseIds).toContain(3);
    });

    it('❌ rejected: sets status to failed and records error message', async () => {
        mockGetStudentHistory.mockRejectedValue(new Error('Network error'));

        const store = makeStore();
        await store.dispatch(fetchStudentHistory(101));

        const state = store.getState() as never;
        expect(selectHistoryStatus(state)).toBe('failed');
        expect(selectHistoryError(state)).toBe('Network error');
        // selector still returns safe empty default on failure
        expect(selectStudentHistory(state)).toEqual({
            completedCourseIds: [],
            activeCourseIds: [],
            allEnrollments: [],
        });
    });

    it('❌ rejected: uses fallback message when error is not an Error instance', async () => {
        mockGetStudentHistory.mockRejectedValue('something unexpected');

        const store = makeStore();
        await store.dispatch(fetchStudentHistory(101));

        const state = store.getState() as never;
        expect(selectHistoryError(state)).toBe('Failed to load course history.');
    });

    it('fulfilled overwrites previous history on re-fetch', async () => {
        const firstHistory = { completedCourseIds: [1], activeCourseIds: [], allEnrollments: [] };
        const secondHistory = { completedCourseIds: [1, 2], activeCourseIds: [3], allEnrollments: [] };

        mockGetStudentHistory.mockResolvedValueOnce(firstHistory);
        const store = makeStore();
        await store.dispatch(fetchStudentHistory(101));
        expect(selectStudentHistory(store.getState() as never)).toEqual(firstHistory);

        mockGetStudentHistory.mockResolvedValueOnce(secondHistory);
        await store.dispatch(fetchStudentHistory(101));
        expect(selectStudentHistory(store.getState() as never)).toEqual(secondHistory);
    });
});
