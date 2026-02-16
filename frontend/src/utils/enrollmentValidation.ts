import { Course, CourseWithEnrollmentStatus } from '../types/course';
import { StudentCourseHistory } from '../types/student';

export type EnrollmentBlockReason = 'grade_mismatch' | 'missing_prerequisite' | 'already_enrolled' | null;

export interface ValidationResult {
    canEnroll: boolean;
    reason: EnrollmentBlockReason;
    prerequisiteCourseName?: string;
}

/**
 * Validates if a student can enroll in a course
 * @param course - The course to validate
 * @param studentGradeLevel - Student's current grade level
 * @param courseHistory - Student's enrollment history
 * @param allCourses - Map of all available courses (for prerequisite lookup)
 */
export const validateEnrollment = (
    course: Course,
    studentGradeLevel: number,
    courseHistory: StudentCourseHistory,
    allCourses: Map<number, Course>
): ValidationResult => {
    // Check 1: Already enrolled
    if (courseHistory.activeCourseIds.includes(course.id)) {
        return {
            canEnroll: false,
            reason: 'already_enrolled',
        };
    }

    // Check 2: Grade level mismatch
    if (studentGradeLevel < course.gradeLevelMin || studentGradeLevel > course.gradeLevelMax) {
        return {
            canEnroll: false,
            reason: 'grade_mismatch',
        };
    }

    // Check 3: Missing prerequisite
    if (course.prerequisiteId) {
        const hasCompletedPrerequisite = courseHistory.completedCourseIds.includes(course.prerequisiteId);
        if (!hasCompletedPrerequisite) {
            const prerequisiteCourse = allCourses.get(course.prerequisiteId);
            return {
                canEnroll: false,
                reason: 'missing_prerequisite',
                prerequisiteCourseName: prerequisiteCourse?.name || 'Unknown Course',
            };
        }
    }

    // All checks passed
    return {
        canEnroll: true,
        reason: null,
    };
};

/**
 * Enriches courses with enrollment status for a student
 */
export const enrichCoursesWithEnrollmentStatus = (
    courses: Course[],
    studentGradeLevel: number,
    courseHistory: StudentCourseHistory
): CourseWithEnrollmentStatus[] => {
    const courseMap = new Map(courses.map(c => [c.id, c]));

    return courses.map(course => {
        const validation = validateEnrollment(course, studentGradeLevel, courseHistory, courseMap);

        return {
            ...course,
            canEnroll: validation.canEnroll,
            enrollmentBlockReason: validation.reason,
            prerequisiteCourseName: validation.prerequisiteCourseName,
        };
    });
};

/**
 * Gets a human-readable message for enrollment block reasons
 */
export const getEnrollmentBlockMessage = (
    reason: EnrollmentBlockReason,
    prerequisiteCourseName?: string
): string => {
    switch (reason) {
        case 'grade_mismatch':
            return 'Your grade level does not match the requirements for this course';
        case 'missing_prerequisite':
            return `You must complete ${prerequisiteCourseName} before enrolling in this course`;
        case 'already_enrolled':
            return 'You are already enrolled in this course';
        default:
            return '';
    }
};
