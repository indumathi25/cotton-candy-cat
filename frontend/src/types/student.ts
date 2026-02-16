export interface Student {
    id: number;
    username: string;
    email?: string;
    gradeLevel: number;
    gpa?: number;
}

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

export interface StudentEnrollment {
    courseId: number;
    courseName: string;
    courseCode: string;
    semesterOrder: number;
    grade?: string;
    status: 'active' | 'completed' | 'dropped';
}

export interface StudentCourseHistory {
    completedCourseIds: number[];
    activeCourseIds: number[];
    allEnrollments: StudentEnrollment[];
}

export interface CourseSection {
    id: number;
    timeSlot: {
        dayOfWeek: string;
        startTime: string;
        endTime: string;
    };
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
