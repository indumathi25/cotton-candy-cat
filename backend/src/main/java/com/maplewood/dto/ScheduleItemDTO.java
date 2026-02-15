package com.maplewood.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScheduleItemDTO {
    private String courseName;
    private String courseCode;
    private String teacherName;
    private Integer classroomId;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
}
