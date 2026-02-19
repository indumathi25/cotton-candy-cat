/**
 * UI-related constants and shared Tailwind CSS utility classes
 */

export const UI_COLORS = ['blue', 'green', 'purple', 'orange', 'red', 'indigo'] as const;
export type UIColor = (typeof UI_COLORS)[number];

export const ACTION_CARD_COLORS = {
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
} as const;

export const STAT_CARD_COLORS = {
    blue: {
        text: 'text-blue-600',
        bg: 'bg-blue-100',
    },
    green: {
        text: 'text-green-600',
        bg: 'bg-green-100',
    },
    purple: {
        text: 'text-purple-600',
        bg: 'bg-purple-100',
    },
    orange: {
        text: 'text-orange-600',
        bg: 'bg-orange-100',
    },
    red: {
        text: 'text-red-600',
        bg: 'bg-red-100',
    },
    indigo: {
        text: 'text-indigo-600',
        bg: 'bg-indigo-100',
    },
} as const;

export const BUTTON_VARIANTS = {
    primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
    success: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300',
} as const;

export const BUTTON_SIZES = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
} as const;

export const PROGRESS_BAR_COLORS = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
} as const;

export const MODAL_VARIANTS = {
    success: 'border-t-4 border-green-500',
    error: 'border-t-4 border-red-500',
    info: 'border-t-4 border-blue-500',
} as const;

export const GRADE_COLORS: Record<string, string> = {
    A: 'text-green-600 font-semibold',
    B: 'text-blue-600 font-semibold',
    C: 'text-yellow-600 font-semibold',
    D: 'text-orange-600 font-semibold',
    F: 'text-red-600 font-semibold',
};

export const ACADEMIC_STANDING = [
    { minGpa: 3.5, text: 'Excellent', color: 'text-green-600' },
    { minGpa: 3.0, text: 'Good', color: 'text-blue-600' },
    { minGpa: 2.0, text: 'Satisfactory', color: 'text-yellow-600' },
    { minGpa: 0.0, text: 'Needs Improvement', color: 'text-red-600' },
] as const;

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
] as const;
