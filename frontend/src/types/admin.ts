export interface DashboardStat {
    id: string;
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
}

export interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
    onClick: () => void;
}

export interface AdminDashboardData {
    stats: DashboardStat[];
    actions: QuickAction[];
}

export interface AdminStats {
    totalStudents: number;
    totalCourses: number;
    totalTeachers: number;
    totalClassrooms: number;
    studentsPerGrade?: number;
    coreCoursesCount?: number;
    electiveCoursesCount?: number;
    specializationsCount?: number;
}
