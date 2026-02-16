import React from 'react';

interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
    className?: string;
    color?: 'blue' | 'green' | 'purple' | 'gradient';
}

const colorStyles: Record<string, string> = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    label,
    showPercentage = true,
    className = '',
    color = 'gradient',
}) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className={className}>
            {(label || showPercentage) && (
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    {label && <span>{label}</span>}
                    {showPercentage && <span>{percentage.toFixed(1)}%</span>}
                </div>
            )}
            <div
                className="w-full bg-gray-200 rounded-full h-3"
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={label || `Progress: ${percentage.toFixed(1)}%`}
            >
                <div
                    className={`${colorStyles[color]} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};
