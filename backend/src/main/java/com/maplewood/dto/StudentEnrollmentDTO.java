package com.maplewood.dto;

public record StudentEnrollmentDTO(
        Long courseId,
        String courseName,
        String courseCode,
        Integer semesterOrder,
        String grade,
        Integer credits,
        String status // 'active', 'completed', 'dropped'
) {
}
