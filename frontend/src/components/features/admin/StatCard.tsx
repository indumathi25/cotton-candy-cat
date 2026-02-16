import React from 'react';
import { Card } from '../../common';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    color?: 'blue' | 'green' | 'purple' | 'orange';
}

const colorStyles = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
};

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon,
    color = 'blue',
}) => {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorStyles[color]}`}>
                    <span className="text-2xl">{icon}</span>
                </div>
            </div>
        </Card>
    );
};
