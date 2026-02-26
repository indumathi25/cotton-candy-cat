package com.maplewood.mapper;

import com.maplewood.dto.CourseDto;
import com.maplewood.model.Course;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    CourseDto toDto(Course course);
}
