package com.maplewood.dto;

public record CourseSectionDto(
        Long id,
        String teacherName,
        String dayOfWeek,
        String startTime,
        String endTime,
        Integer classroomId,
        Integer capacity,
        Long enrolledCount) {
}
