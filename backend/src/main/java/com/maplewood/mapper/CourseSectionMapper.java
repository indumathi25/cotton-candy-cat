package com.maplewood.mapper;

import com.maplewood.dto.CourseSectionDto;
import com.maplewood.model.CourseSection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseSectionMapper {

    @Mapping(target = "teacherName", expression = "java(section.getTeacher().getFirstName() + \" \" + section.getTeacher().getLastName())")
    @Mapping(target = "dayOfWeek", source = "section.timeSlot.dayOfWeek")
    @Mapping(target = "startTime", source = "section.timeSlot.startTime")
    @Mapping(target = "endTime", source = "section.timeSlot.endTime")
    @Mapping(target = "enrolledCount", source = "enrolledCount")
    CourseSectionDto toDto(CourseSection section, Long enrolledCount);
}
