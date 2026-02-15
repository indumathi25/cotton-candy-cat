package com.maplewood.controller;

import com.maplewood.dto.CourseDto;
import com.maplewood.service.CourseService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public org.springframework.data.domain.Page<CourseDto> getCourses(
            @RequestParam(required = false) Integer grade,
            org.springframework.data.domain.Pageable pageable) {
        return courseService.getCourses(grade, pageable);
    }
}
