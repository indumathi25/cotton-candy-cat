import React from 'react';

import { MODAL_VARIANTS } from '../../constants/ui';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    variant?: keyof typeof MODAL_VARIANTS;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    variant = 'info'
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 relative shadow-xl ${MODAL_VARIANTS[variant]}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    aria-label="Close modal"
                >
                    ✕
                </button>
                <h3 id="modal-title" className="text-lg font-bold mb-4">{title}</h3>
                <div className="mb-6">{children}</div>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
