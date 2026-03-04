package com.maplewood.dto;

public record AdminStatsDTO(
        Integer totalStudents,
        Integer totalCourses,
        Integer totalTeachers,
        Integer totalClassrooms,
        Integer studentsPerGrade,
        Integer coreCoursesCount,
        Integer electiveCoursesCount,
        Integer specializationsCount) {
}
