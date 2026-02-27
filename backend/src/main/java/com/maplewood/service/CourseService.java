package com.maplewood.service;

import com.maplewood.dto.CourseDto;
import com.maplewood.dto.CourseSectionDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CourseService {

    Page<CourseDto> getCourses(Integer grade, String search, Pageable pageable);

    List<CourseSectionDto> getCourseSections(Long courseId);
}
