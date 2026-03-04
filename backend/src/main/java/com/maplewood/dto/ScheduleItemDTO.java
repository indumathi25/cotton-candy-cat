package com.maplewood.dto;

public record ScheduleItemDTO(
        String courseName,
        String courseCode,
        String teacherName,
        Integer classroomId,
        String dayOfWeek,
        String startTime,
        String endTime) {
}
