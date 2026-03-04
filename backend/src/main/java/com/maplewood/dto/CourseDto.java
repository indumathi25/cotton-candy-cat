package com.maplewood.dto;

public record CourseDto(
        Long id,
        String code,
        String name,
        String description,
        Integer credits,
        Integer gradeLevelMin,
        Integer gradeLevelMax,
        Integer hoursPerWeek,
        Integer semesterOrder,
        Long prerequisiteId) {
}
