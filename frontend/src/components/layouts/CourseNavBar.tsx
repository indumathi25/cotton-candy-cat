import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const CourseNavBar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { label: 'Browse Courses', path: '/student/courses' },
        { label: 'My Courses', path: '/student' },
        { label: 'Schedule', path: '/student/schedule' },
        { label: 'Grades', path: '/student/grades' },
        { label: 'Profile', path: '/student/profile' },
    ];

    const isActive = (path: string) => {
        if (path === '/student') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <ul className="flex space-x-8 overflow-x-auto">
                    {navItems.map((item) => (
                        <li key={item.path + item.label} className="flex-shrink-0">
                            <Link
                                to={item.path}
                                className={`
                                    inline-block py-4 px-2 text-sm font-medium border-b-2 transition-colors
                                    ${isActive(item.path)
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }
                                `}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};
