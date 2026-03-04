package com.maplewood.dto;

import java.util.List;

public record GradeReportDTO(
        Long studentId,
        String studentName,
        Integer gradeLevel,
        Double overallGpa,
        Integer totalCreditsEarned,
        Integer totalCreditsAttempted,
        List<CourseGradeDTO> courseGrades) {
}
