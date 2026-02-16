import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
}

const colorClasses = {
    blue: {
        text: 'text-blue-600',
        bg: 'bg-blue-100',
    },
    green: {
        text: 'text-green-600',
        bg: 'bg-green-100',
    },
    purple: {
        text: 'text-purple-600',
        bg: 'bg-purple-100',
    },
    orange: {
        text: 'text-orange-600',
        bg: 'bg-orange-100',
    },
    red: {
        text: 'text-red-600',
        bg: 'bg-red-100',
    },
    indigo: {
        text: 'text-indigo-600',
        bg: 'bg-indigo-100',
    },
};

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    color,
}) => {
    const colors = colorClasses[color];

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
                </div>
                <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
        </div>
    );
};
