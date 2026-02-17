package com.maplewood.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponseDTO {
    private Long enrollmentId;
    private String studentName;
    private String courseName;
    private String semesterName;
    private String status;
    private String message;

    public boolean isSuccess() {
        return "SUCCESS".equalsIgnoreCase(status);
    }
}
