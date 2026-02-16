import React from 'react';
import { Button } from './Button';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onRetry,
    className = '',
}) => {
    return (
        <div
            className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}
            role="alert"
        >
            <p className="text-red-700 mb-4">{message}</p>
            {onRetry && (
                <Button
                    variant="danger"
                    onClick={onRetry}
                    aria-label="Retry loading data"
                >
                    Retry
                </Button>
            )}
        </div>
    );
};
