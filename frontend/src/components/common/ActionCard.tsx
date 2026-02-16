import React from 'react';

interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
    onClick?: () => void;
    ariaLabel?: string;
}

const colorClasses = {
    blue: {
        text: 'text-blue-600',
        border: 'hover:border-blue-500',
        focus: 'focus:ring-blue-300',
    },
    green: {
        text: 'text-green-600',
        border: 'hover:border-green-500',
        focus: 'focus:ring-green-300',
    },
    purple: {
        text: 'text-purple-600',
        border: 'hover:border-purple-500',
        focus: 'focus:ring-purple-300',
    },
    orange: {
        text: 'text-orange-600',
        border: 'hover:border-orange-500',
        focus: 'focus:ring-orange-300',
    },
    red: {
        text: 'text-red-600',
        border: 'hover:border-red-500',
        focus: 'focus:ring-red-300',
    },
    indigo: {
        text: 'text-indigo-600',
        border: 'hover:border-indigo-500',
        focus: 'focus:ring-indigo-300',
    },
};

export const ActionCard: React.FC<ActionCardProps> = ({
    title,
    description,
    icon,
    color,
    onClick,
    ariaLabel,
}) => {
    const colors = colorClasses[color];

    return (
        <button
            onClick={onClick}
            className={`bg-white hover:bg-gray-50 rounded-xl shadow-md p-6 text-left transition border-2 border-transparent ${colors.border} focus:ring-4 ${colors.focus}`}
            aria-label={ariaLabel || title}
        >
            <div className="flex items-center mb-2">
                <div className={`w-6 h-6 ${colors.text} mr-2`}>
                    {icon}
                </div>
                <h4 className="font-semibold text-gray-900">{title}</h4>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
        </button>
    );
};
