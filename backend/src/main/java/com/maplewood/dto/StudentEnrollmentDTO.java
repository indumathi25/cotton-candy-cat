package com.maplewood.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentEnrollmentDTO {
    private Long courseId;
    private String courseName;
    private String courseCode;
    private Integer semesterOrder;
    private String grade;
    private Integer credits;
    private String status; // 'active', 'completed', 'dropped'
}
