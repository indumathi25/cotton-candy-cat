export interface Student {
    id: number;
    username: string;
    email?: string;
    gradeLevel: number;
    gpa?: number;
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
