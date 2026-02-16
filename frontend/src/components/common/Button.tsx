import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
    success: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className = '',
    disabled,
    children,
    ...props
}) => {
    const baseStyles = 'font-semibold rounded-lg transition duration-200 focus:ring-4 focus:outline-none';
    const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${widthStyles} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center justify-center">
                    <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Loading...</span>
                </span>
            ) : (
                children
            )}
        </button>
    );
};
