package com.maplewood.dto;

public record CourseGradeDTO(
        Long enrollmentId,
        String courseCode,
        String courseName,
        String teacherName,
        String semester,
        String grade,
        Double credits,
        String status) {
}
