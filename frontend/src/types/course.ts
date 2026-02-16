export interface Course {
    id: number;
    code: string;
    name: string;
    description?: string;
    credits: number;
    gradeLevelMin: number;
    gradeLevelMax: number;
    hoursPerWeek: number;
    semesterOrder: number;
    prerequisiteId?: number | null;
}

export interface CourseWithEnrollmentStatus extends Course {
    canEnroll: boolean;
    enrollmentBlockReason?: 'grade_mismatch' | 'missing_prerequisite' | 'already_enrolled' | null;
    prerequisiteCourseName?: string;
}
