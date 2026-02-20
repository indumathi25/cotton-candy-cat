import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import uiReducer, {
    setSelectedGrade,
    setSearchTerm,
    setCurrentPage,
    resetCourseFilters,
    setScheduleViewMode,
    toggleSidebar,
    setSidebarOpen,
    selectSelectedGrade,
    selectSearchTerm,
    selectCurrentPage,
    selectScheduleViewMode,
    selectSidebarOpen,
    selectCourseFilter,
} from './uiSlice';

// ─── Store Helper ─────────────────────────────────────────────────────────────
const makeStore = () =>
    configureStore({ reducer: { ui: uiReducer } });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('uiSlice — course filters', () => {
    it('should return correct initial state', () => {
        const store = makeStore();
        const state = store.getState() as never;

        expect(selectSelectedGrade(state)).toBeNull();
        expect(selectSearchTerm(state)).toBe('');
        expect(selectCurrentPage(state)).toBe(0);
    });

    it('setSelectedGrade should update selected grade and reset page to 0', () => {
        const store = makeStore();

        // Advance to page 3 first
        store.dispatch(setCurrentPage(3));
        expect(selectCurrentPage(store.getState() as never)).toBe(3);

        // Changing grade should reset to page 0
        store.dispatch(setSelectedGrade(10));
        const state = store.getState() as never;
        expect(selectSelectedGrade(state)).toBe(10);
        expect(selectCurrentPage(state)).toBe(0); // ← pagination reset
    });

    it('setSelectedGrade(null) should clear the filter', () => {
        const store = makeStore();
        store.dispatch(setSelectedGrade(9));
        store.dispatch(setSelectedGrade(null));

        expect(selectSelectedGrade(store.getState() as never)).toBeNull();
    });

    it('setSearchTerm should update searchTerm and reset page to 0', () => {
        const store = makeStore();

        store.dispatch(setCurrentPage(2));
        store.dispatch(setSearchTerm('calculus'));

        const state = store.getState() as never;
        expect(selectSearchTerm(state)).toBe('calculus');
        expect(selectCurrentPage(state)).toBe(0); // ← pagination reset
    });

    it('setCurrentPage should update page without affecting other filters', () => {
        const store = makeStore();
        store.dispatch(setSelectedGrade(11));
        store.dispatch(setCurrentPage(4));

        const state = store.getState() as never;
        expect(selectCurrentPage(state)).toBe(4);
        expect(selectSelectedGrade(state)).toBe(11); // unchanged
    });

    it('resetCourseFilters should restore all filter defaults', () => {
        const store = makeStore();
        store.dispatch(setSelectedGrade(10));
        store.dispatch(setSearchTerm('math'));
        store.dispatch(setCurrentPage(5));

        store.dispatch(resetCourseFilters());

        const filter = selectCourseFilter(store.getState() as never);
        expect(filter.selectedGrade).toBeNull();
        expect(filter.searchTerm).toBe('');
        expect(filter.currentPage).toBe(0);
        expect(filter.pageSize).toBe(20);
    });
});

describe('uiSlice — schedule view mode', () => {
    it('should default to grid view', () => {
        const store = makeStore();
        expect(selectScheduleViewMode(store.getState() as never)).toBe('grid');
    });

    it('setScheduleViewMode should switch to list', () => {
        const store = makeStore();
        store.dispatch(setScheduleViewMode('list'));
        expect(selectScheduleViewMode(store.getState() as never)).toBe('list');
    });

    it('setScheduleViewMode should switch back to grid', () => {
        const store = makeStore();
        store.dispatch(setScheduleViewMode('list'));
        store.dispatch(setScheduleViewMode('grid'));
        expect(selectScheduleViewMode(store.getState() as never)).toBe('grid');
    });
});

describe('uiSlice — sidebar', () => {
    it('should default to closed', () => {
        const store = makeStore();
        expect(selectSidebarOpen(store.getState() as never)).toBe(false);
    });

    it('toggleSidebar should flip the boolean', () => {
        const store = makeStore();
        store.dispatch(toggleSidebar());
        expect(selectSidebarOpen(store.getState() as never)).toBe(true);

        store.dispatch(toggleSidebar());
        expect(selectSidebarOpen(store.getState() as never)).toBe(false);
    });

    it('setSidebarOpen should set explicit value', () => {
        const store = makeStore();
        store.dispatch(setSidebarOpen(true));
        expect(selectSidebarOpen(store.getState() as never)).toBe(true);

        store.dispatch(setSidebarOpen(false));
        expect(selectSidebarOpen(store.getState() as never)).toBe(false);
    });
});
