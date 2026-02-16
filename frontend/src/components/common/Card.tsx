import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
    noShadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
    noPadding = false,
    noShadow = false,
    className = '',
    children,
    ...props
}) => {
    const baseStyles = 'bg-white rounded-xl';
    const paddingStyles = noPadding ? '' : 'p-6';
    const shadowStyles = noShadow ? 'border border-gray-200' : 'shadow-md';

    return (
        <div
            className={`${baseStyles} ${paddingStyles} ${shadowStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
