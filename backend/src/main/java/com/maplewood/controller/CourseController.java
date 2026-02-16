package com.maplewood.controller;

import com.maplewood.dto.CourseDto;
import com.maplewood.dto.PageResponse;
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
    public PageResponse<CourseDto> getCourses(
            @RequestParam(required = false) Integer grade,
            org.springframework.data.domain.Pageable pageable) {
        return PageResponse.of(courseService.getCourses(grade, pageable));
    }

    @GetMapping("/{courseId}/sections")
    public java.util.List<com.maplewood.dto.CourseSectionDto> getCourseSections(@PathVariable Long courseId) {
        return courseService.getCourseSections(courseId);
    }
}
