package com.maplewood.service;

import com.maplewood.dto.CourseDto;

import java.util.List;

public interface CourseService {

    List<CourseDto> getCourses(Integer grade);
}
