package com.maplewood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseSectionDto {
    private Long id;
    private String teacherName;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private Integer classroomId;
    private Integer capacity;
    private Long enrolledCount;
}
