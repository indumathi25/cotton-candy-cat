import React from 'react';
import { PROGRESS_BAR_COLORS } from '../../constants/ui';

interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
    className?: string;
    color?: keyof typeof PROGRESS_BAR_COLORS;
}

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
                    className={`${PROGRESS_BAR_COLORS[color]} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};
