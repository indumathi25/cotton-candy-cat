import { validateEnrollment, getEnrollmentBlockMessage } from './enrollmentValidation';
import { Course } from '../types/course';
import { StudentCourseHistory } from '../types/student';

describe('enrollmentValidation utils', () => {
    const mockCourse: Course = {
        id: 1,
        name: 'Algebra 1',
        code: 'MATH101',
        description: 'Introduction to Algebra',
        credits: 1,
        gradeLevelMin: 9,
        gradeLevelMax: 10,
        hoursPerWeek: 5,
        semesterOrder: 1,
        prerequisiteId: null
    };

    const mockHistory: StudentCourseHistory = {
        completedCourseIds: [],
        activeCourseIds: [],
        allEnrollments: []
    };

    describe('validateEnrollment', () => {
        it('should return canEnroll: true for valid enrollment', () => {
            const result = validateEnrollment(mockCourse, 9, mockHistory, new Map());
            expect(result.canEnroll).toBe(true);
            expect(result.reason).toBeNull();
        });

        it('should block enrollment if student is already enrolled', () => {
            const history = { ...mockHistory, activeCourseIds: [1] };
            const result = validateEnrollment(mockCourse, 9, history, new Map());
            expect(result.canEnroll).toBe(false);
            expect(result.reason).toBe('already_enrolled');
        });

        it('should block enrollment if grade level is too low', () => {
            const result = validateEnrollment(mockCourse, 8, mockHistory, new Map());
            expect(result.canEnroll).toBe(false);
            expect(result.reason).toBe('grade_mismatch');
        });

        it('should block enrollment if grade level is too high', () => {
            const result = validateEnrollment(mockCourse, 11, mockHistory, new Map());
            expect(result.canEnroll).toBe(false);
            expect(result.reason).toBe('grade_mismatch');
        });

        it('should block enrollment if prerequisite is missing', () => {
            const courseWithPrereq = { ...mockCourse, prerequisiteId: 5 };
            const result = validateEnrollment(courseWithPrereq, 9, mockHistory, new Map());
            expect(result.canEnroll).toBe(false);
            expect(result.reason).toBe('missing_prerequisite');
        });

        it('should allow enrollment if prerequisite is completed', () => {
            const courseWithPrereq = { ...mockCourse, prerequisiteId: 5 };
            const history = { ...mockHistory, completedCourseIds: [5] };
            const result = validateEnrollment(courseWithPrereq, 9, history, new Map());
            expect(result.canEnroll).toBe(true);
        });

        it('should include prerequisite name if found', () => {
            const courseWithPrereq = { ...mockCourse, prerequisiteId: 5 };
            const prereqCourse: Course = { ...mockCourse, id: 5, name: 'Pre-Algebra' };
            const courseMap = new Map([[5, prereqCourse]]);

            const result = validateEnrollment(courseWithPrereq, 9, mockHistory, courseMap);
            expect(result.reason).toBe('missing_prerequisite');
            expect(result.prerequisiteCourseName).toBe('Pre-Algebra');
        });
    });

    describe('getEnrollmentBlockMessage', () => {
        it('should return correct message for grade_mismatch', () => {
            expect(getEnrollmentBlockMessage('grade_mismatch')).toContain('grade level');
        });

        it('should return correct message for missing_prerequisite', () => {
            expect(getEnrollmentBlockMessage('missing_prerequisite', 'Math 101')).toContain('must complete Math 101');
        });

        it('should return correct message for already_enrolled', () => {
            expect(getEnrollmentBlockMessage('already_enrolled')).toContain('already enrolled');
        });
    });
});
