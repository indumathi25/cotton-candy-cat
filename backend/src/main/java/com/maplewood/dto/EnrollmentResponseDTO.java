package com.maplewood.dto;

public record EnrollmentResponseDTO(
        Long enrollmentId,
        String studentName,
        String courseName,
        String semesterName,
        String status,
        String message) {
    public boolean isSuccess() {
        return "SUCCESS".equalsIgnoreCase(status);
    }
}
