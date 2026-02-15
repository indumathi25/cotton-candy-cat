package com.maplewood.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentProfileDTO {
    private Long id;
    private String fullName;
    private Integer gradeLevel;
    private Double gpa;
    private Integer creditsEarned;
    private Integer creditsToGraduate;
    private Integer remainingCredits;
    private Double progressPercentage;
}
