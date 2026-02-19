import React from 'react';

import { STAT_CARD_COLORS, UIColor } from '../../constants/ui';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: UIColor;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    color,
}) => {
    const colors = STAT_CARD_COLORS[color];

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
