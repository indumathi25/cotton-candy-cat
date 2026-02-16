import React from 'react';

interface CourseFiltersProps {
    selectedGrade: number | null;
    onGradeChange: (grade: number | null) => void;
    studentGradeLevel: number;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
    selectedGrade,
    onGradeChange,
    studentGradeLevel,
}) => {
    const grades = [9, 10, 11, 12];

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Courses</h3>
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
                {grades.map(grade => (
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
    );
};
