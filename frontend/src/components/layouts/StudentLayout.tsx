import React, { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { CourseNavBar } from './CourseNavBar';

interface StudentLayoutProps {
    title: string;
    welcomeMessage?: string;
    subtitle?: string;
    children: ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
    title,
    welcomeMessage,
    subtitle,
    children,
}) => {
    return (
        <DashboardLayout
            title={title}
            welcomeMessage={welcomeMessage}
            subtitle={subtitle}
            navBar={<CourseNavBar />}
        >
            {children}
        </DashboardLayout>
    );
};
