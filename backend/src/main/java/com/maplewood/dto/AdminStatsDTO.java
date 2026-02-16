package com.maplewood.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsDTO {
    private Integer totalStudents;
    private Integer totalCourses;
    private Integer totalTeachers;
    private Integer totalClassrooms;
    private Integer studentsPerGrade;
    private Integer coreCoursesCount;
    private Integer electiveCoursesCount;
    private Integer specializationsCount;
}
