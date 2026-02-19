import React from 'react';

import { ACTION_CARD_COLORS, UIColor } from '../../constants/ui';

interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: UIColor;
    onClick?: () => void;
    ariaLabel?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
    title,
    description,
    icon,
    color,
    onClick,
    ariaLabel,
}) => {
    const colors = ACTION_CARD_COLORS[color];

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
