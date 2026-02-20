import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { CoursesPage } from './CoursesPage';
import enrollmentReducer from '../store/enrollmentSlice';
import uiReducer from '../store/uiSlice';
import authReducer from '../store/authSlice';
import studentReducer from '../store/studentSlice';
import type { UserRole } from '../types/auth';

// ─── Mock all API calls ────────────────────────────────────────────────────────
vi.mock('../api/courseService', () => ({
    getCourses: vi.fn(),
    getCourseSections: vi.fn(),
    enrollInCourse: vi.fn(),
}));

vi.mock('../api/studentService', () => ({
    getStudentProfile: vi.fn(),
    getStudentHistory: vi.fn(),
    getStudentSchedule: vi.fn(),
    getGradeReport: vi.fn(),
}));

// ─── Mock layout components ───────────────────────────────────────────────────
vi.mock('../components/layouts/StudentLayout', () => ({
    StudentLayout: ({ children, title }: { children: React.ReactNode; title: string }) => (
        <div data-testid="student-layout">
            <h1>{title}</h1>
            {children}
        </div>
    ),
}));

vi.mock('../components/common', async () => ({
    LoadingSkeleton: () => <div data-testid="loading-skeleton" />,
    Modal: () => null,
    ErrorMessage: ({ message }: { message: string }) => <p>{message}</p>,
}));

// ─── Mock CourseBrowser — we test the page's Redux wiring, not the full tree ──
// The real CourseBrowser relies on enrichCoursesWithEnrollmentStatus
// which crashes without a full data shape. We stub it with a simple enroll button.
vi.mock('../components/features/courses/CourseBrowser', () => ({
    CourseBrowser: ({
        onEnroll,
        isEnrolling,
    }: {
        onEnroll: (id: number) => void;
        isEnrolling?: boolean;
        selectedGrade: number | null;
        onGradeChange: (g: number | null) => void;
        courseHistory: unknown;
        studentGradeLevel: number;
    }) => (
        <div data-testid="course-browser">
            <button
                onClick={() => onEnroll(1)}
                disabled={isEnrolling}
                aria-label="Enroll in course 1"
            >
                {isEnrolling ? 'Enrolling...' : 'Enroll in Algebra 1'}
            </button>
        </div>
    ),
}));

// ─── Imports after mocks ──────────────────────────────────────────────────────
import { getCourseSections, enrollInCourse } from '../api/courseService';
import { getStudentProfile, getStudentHistory } from '../api/studentService';

const mockGetCourseSections = vi.mocked(getCourseSections);
const mockEnrollInCourse = vi.mocked(enrollInCourse);
const mockGetStudentProfile = vi.mocked(getStudentProfile);
const mockGetStudentHistory = vi.mocked(getStudentHistory);

// ─── Test Fixtures ────────────────────────────────────────────────────────────
const mockProfile = {
    id: 101, fullName: 'Emma Wilson', gradeLevel: 10,
    gpa: 3.8, creditsEarned: 20, creditsToGraduate: 30,
    progressPercentage: 67, remainingCredits: 10,
};
const mockHistory = { completedCourseIds: [5], activeCourseIds: [], allEnrollments: [] };
const mockSection = { id: 99, capacity: 30, timeSlot: { dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00' } } as never;

// ─── Render Helper ────────────────────────────────────────────────────────────
const renderPage = () => {
    const store = configureStore({
        reducer: { auth: authReducer, enrollment: enrollmentReducer, ui: uiReducer, student: studentReducer },
        preloadedState: {
            auth: {
                user: { studentId: 101, role: 'STUDENT' as UserRole, username: 'student' },
                credentials: { username: 'student', password: 'password' },
                isAuthenticated: true,
            },
            enrollment: { pendingSections: [], enrolledSectionIds: [], status: 'idle' as const, error: null, notifications: [] },
            ui: { courseFilter: { selectedGrade: null, searchTerm: '', currentPage: 0, pageSize: 20 }, scheduleViewMode: 'grid' as const, sidebarOpen: false },
            student: { history: mockHistory, historyStatus: 'succeeded' as const, historyError: null },
        },
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <MemoryRouter><CoursesPage /></MemoryRouter>
            </QueryClientProvider>
        </Provider>
    );

    return { store };
};

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('CoursesPage — integration tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetStudentProfile.mockResolvedValue(mockProfile);
        mockGetStudentHistory.mockResolvedValue(mockHistory);
    });

    it('should show loading skeleton while profile loads', () => {
        mockGetStudentProfile.mockReturnValue(new Promise(() => { }));
        renderPage();
        expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('should render CourseBrowser once profile is loaded', async () => {
        renderPage();
        await waitFor(() => {
            expect(screen.getByTestId('course-browser')).toBeInTheDocument();
        });
    });

    it('✅ dispatches enrollStudent thunk and shows success notification on enroll', async () => {
        mockGetCourseSections.mockResolvedValue([mockSection]);
        mockEnrollInCourse.mockResolvedValue({ success: true });

        const { store } = renderPage();

        await waitFor(() => expect(screen.getByTestId('course-browser')).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', { name: /enroll in course 1/i }));

        // Notification toast appears
        await waitFor(() => {
            expect(screen.getByText('Enrollment Successful!')).toBeInTheDocument();
        });

        // Redux store reflects success
        const state = store.getState();
        expect(state.enrollment.status).toBe('succeeded');
        expect(state.enrollment.enrolledSectionIds).toContain(99);
        expect(state.enrollment.notifications[0].type).toBe('success');

        // APIs were called correctly
        expect(mockGetCourseSections).toHaveBeenCalledWith(1);
        expect(mockEnrollInCourse).toHaveBeenCalledWith(101, 99);
    });

    it('❌ shows error notification when no sections are available', async () => {
        mockGetCourseSections.mockResolvedValue([]);

        const { store } = renderPage();
        await waitFor(() => expect(screen.getByTestId('course-browser')).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', { name: /enroll in course 1/i }));

        await waitFor(() => {
            expect(screen.getByText('Enrollment Failed')).toBeInTheDocument();
        });
        expect(screen.getByText(/No sections are currently available/i)).toBeInTheDocument();
        expect(store.getState().enrollment.status).toBe('failed');
    });

    it('❌ shows server error message when enrollment POST fails', async () => {
        mockGetCourseSections.mockResolvedValue([mockSection]);
        mockEnrollInCourse.mockRejectedValue(new Error('Maximum course limit (5) reached'));

        const { store } = renderPage();
        await waitFor(() => expect(screen.getByTestId('course-browser')).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', { name: /enroll in course 1/i }));

        await waitFor(() => {
            expect(screen.getByText(/Maximum course limit \(5\) reached/i)).toBeInTheDocument();
        });
        expect(store.getState().enrollment.notifications[0].type).toBe('error');
    });

    it('should dismiss a notification when × is clicked', async () => {
        mockGetCourseSections.mockResolvedValue([mockSection]);
        mockEnrollInCourse.mockResolvedValue({ success: true });

        renderPage();
        await waitFor(() => expect(screen.getByTestId('course-browser')).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', { name: /enroll in course 1/i }));
        await waitFor(() => expect(screen.getByText('Enrollment Successful!')).toBeInTheDocument());

        // Click × to dismiss
        fireEvent.click(screen.getByRole('button', { name: '×' }));

        await waitFor(() => {
            expect(screen.queryByText('Enrollment Successful!')).not.toBeInTheDocument();
        });
    });

    it('should disable enroll button while enrollment is in-flight', async () => {
        // Never resolve so we stay in loading state
        mockGetCourseSections.mockReturnValue(new Promise(() => { }));

        renderPage();
        await waitFor(() => expect(screen.getByTestId('course-browser')).toBeInTheDocument());

        const enrollBtn = screen.getByRole('button', { name: /enroll in course 1/i });
        fireEvent.click(enrollBtn);

        // Button should become disabled (isEnrolling = true passed to CourseBrowser)
        // Note: disabled buttons are excluded from accessible role name queries,
        // so we query by text content and check the disabled attribute separately.
        await waitFor(() => {
            const btn = screen.getByText('Enrolling...');
            expect(btn).toBeDisabled();
        });
    });
});
