import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    const hasError = !!error;

    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${hasError
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
                    } ${className}`}
                aria-invalid={hasError}
                aria-describedby={
                    error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                }
                {...props}
            />
            {error && (
                <p
                    id={`${inputId}-error`}
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                >
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p
                    id={`${inputId}-helper`}
                    className="mt-1 text-sm text-gray-500"
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};
