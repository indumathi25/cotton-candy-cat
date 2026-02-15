package com.maplewood.service;

import com.maplewood.dto.CourseDto;

public interface CourseService {

    org.springframework.data.domain.Page<CourseDto> getCourses(Integer grade,
            org.springframework.data.domain.Pageable pageable);
}
