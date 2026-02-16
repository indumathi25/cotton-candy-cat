package com.maplewood.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeReportDTO {
    private Long studentId;
    private String studentName;
    private Integer gradeLevel;
    private Double overallGpa;
    private Integer totalCreditsEarned;
    private Integer totalCreditsAttempted;
    private List<CourseGradeDTO> courseGrades;
}
