import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { CourseCard } from './CourseCard';
import { CourseWithEnrollmentStatus } from '../../../types/course';

describe('CourseCard', () => {
    const mockCourse: CourseWithEnrollmentStatus = {
        id: 1,
        name: 'Algebra 1',
        code: 'MATH101',
        description: 'Introduction to Algebra',
        credits: 1,
        gradeLevelMin: 9,
        gradeLevelMax: 10,
        hoursPerWeek: 5,
        semesterOrder: 1,
        prerequisiteId: null,
        canEnroll: true,
        enrollmentBlockReason: null
    };

    const mockOnEnroll = vi.fn();

    beforeEach(() => {
        mockOnEnroll.mockClear();
    });

    it('should render course details correctly', () => {
        render(<CourseCard course={mockCourse} onEnroll={mockOnEnroll} />);

        expect(screen.getByText('Algebra 1')).toBeInTheDocument();
        expect(screen.getByText('MATH101')).toBeInTheDocument();
        expect(screen.getByText('1 Credit')).toBeInTheDocument();
        expect(screen.getByText('Grades 9-10')).toBeInTheDocument();
    });

    it('should show "Add to Schedule" button when student can enroll', () => {
        render(<CourseCard course={mockCourse} onEnroll={mockOnEnroll} />);

        const enrollButton = screen.getByRole('button', { name: /add algebra 1 to schedule/i });
        expect(enrollButton).toBeInTheDocument();
        expect(enrollButton).not.toBeDisabled();
    });

    it('should call onEnroll when "Add to Schedule" is clicked', async () => {
        render(<CourseCard course={mockCourse} onEnroll={mockOnEnroll} />);

        const enrollButton = screen.getByRole('button', { name: /add algebra 1 to schedule/i });
        fireEvent.click(enrollButton);

        expect(mockOnEnroll).toHaveBeenCalledWith(1);

        // Wait for state updates to finish
        await screen.findByRole('button', { name: /add algebra 1 to schedule/i });
    });

    it('should show "Cannot Enroll" and disable button when canEnroll is false', () => {
        const blockedCourse = {
            ...mockCourse,
            canEnroll: false,
            enrollmentBlockReason: 'grade_mismatch' as const
        };

        render(<CourseCard course={blockedCourse} onEnroll={mockOnEnroll} />);

        const enrollButton = screen.getByRole('button', { name: /cannot enroll in algebra 1/i });
        expect(enrollButton).toBeInTheDocument();
        expect(enrollButton).toBeDisabled();
        expect(screen.getByText(/your grade level does not match/i)).toBeInTheDocument();
    });

    it('should show prerequisite message when missing prerequisite', () => {
        const blockedCourse = {
            ...mockCourse,
            canEnroll: false,
            enrollmentBlockReason: 'missing_prerequisite' as const,
            prerequisiteCourseName: 'Pre-Algebra'
        };

        render(<CourseCard course={blockedCourse} onEnroll={mockOnEnroll} />);

        expect(screen.getByText(/you must complete Pre-Algebra before enrolling/i)).toBeInTheDocument();
    });
});
