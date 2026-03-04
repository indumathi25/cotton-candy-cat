import React from 'react';
import { GRADE_LEVELS } from '../../../constants';

interface CourseFiltersProps {
    selectedGrade: number | null;
    onGradeChange: (grade: number | null) => void;
    studentGradeLevel: number;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
    selectedGrade,
    onGradeChange,
    studentGradeLevel,
    searchTerm,
    onSearchChange,
}) => {
    const [localSearch, setLocalSearch] = React.useState(searchTerm);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync local state when Redux is cleared externally, and clean up timer on unmount
    React.useEffect(() => {
        setLocalSearch(searchTerm);
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [searchTerm]);

    const handleSearchInput = (value: string) => {
        setLocalSearch(value);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => onSearchChange(value), 600);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                    <label htmlFor="course-search" className="sr-only">Search courses</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">🔍</span>
                        </div>
                        <input
                            type="text"
                            id="course-search"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                            placeholder="Search by course name or code..."
                            value={localSearch}
                            onChange={(e) => handleSearchInput(e.target.value)}
                        />
                        {localSearch && (
                            <button
                                onClick={() => {
                                    setLocalSearch('');
                                    onSearchChange('');
                                }}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filter by Grade</h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onGradeChange(null)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedGrade === null
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        aria-label="Show all grades"
                    >
                        All Grades
                    </button>
                    {GRADE_LEVELS.map(grade => (
                        <button
                            key={grade}
                            onClick={() => onGradeChange(grade)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedGrade === grade
                                ? 'bg-blue-600 text-white'
                                : grade === studentGradeLevel
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            aria-label={`Filter by grade ${grade}${grade === studentGradeLevel ? ' (your grade)' : ''}`}
                        >
                            Grade {grade}
                            {grade === studentGradeLevel && <span className="ml-1">✓</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
