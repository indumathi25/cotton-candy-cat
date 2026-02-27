// API Response types matching backend DTOs

export interface StudentProfile {
    id: number;
    fullName: string;
    gradeLevel: number;
    gpa: number;
    creditsEarned: number;
    creditsToGraduate: number;
    remainingCredits: number;
    progressPercentage: number;
}

export interface ScheduleItem {
    courseName: string;
    courseCode: string;
    teacherName: string;
    classroomId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

export interface StudentSchedule {
    studentId: number;
    studentName: string;
    semesterName: string;
    schedule: ScheduleItem[];
}

export interface Course {
    id: number;
    code: string;
    name: string;
    description: string;
    credits: number;
    courseType: string;
    gradeLevelMin: number;
    gradeLevelMax: number;
}

export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    status: number;
    timestamp?: string;
}

export interface StudentEnrollmentDTO {
    courseId: number;
    courseName: string;
    courseCode: string;
    semesterOrder: number;
    grade?: string;
    credits: number;
    status: string; // 'active', 'passed', 'failed', 'dropped', 'completed'
}

export interface StudentCourseHistory {
    completedCourseIds: number[];
    activeCourseIds: number[];
    allEnrollments: StudentEnrollmentDTO[];
}

export interface CourseGrade {
    enrollmentId: number;
    courseCode: string;
    courseName: string;
    teacherName: string;
    semester: string;
    grade: string | null;
    credits: number;
    status: string;
}

export interface GradeReport {
    studentId: number;
    studentName: string;
    gradeLevel: number;
    overallGpa: number;
    totalCreditsEarned: number;
    totalCreditsAttempted: number;
    courseGrades: CourseGrade[];
}
