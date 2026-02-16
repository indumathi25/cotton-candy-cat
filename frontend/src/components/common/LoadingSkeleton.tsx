import React from 'react';

type SkeletonVariant = 'text' | 'card' | 'table';

interface LoadingSkeletonProps {
    variant?: SkeletonVariant;
    lines?: number;
    className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    variant = 'text',
    lines = 3,
    className = '',
}) => {
    if (variant === 'card') {
        return (
            <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (variant === 'table') {
        return (
            <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    // Default text variant
    return (
        <div className={`animate-pulse space-y-3 ${className}`}>
            {[...Array(lines)].map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-gray-200 rounded"
                    style={{ width: `${Math.random() * 30 + 60}%` }}
                ></div>
            ))}
        </div>
    );
};
