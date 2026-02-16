package com.maplewood.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseGradeDTO {
    private Long enrollmentId;
    private String courseCode;
    private String courseName;
    private String teacherName;
    private String semester;
    private String grade;
    private Double credits;
    private String status;
}
