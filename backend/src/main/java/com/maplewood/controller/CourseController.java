package com.maplewood.controller;

import com.maplewood.dto.CourseDto;
import com.maplewood.service.CourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<CourseDto> getCourses(
            @RequestParam(required = false) Integer grade) {
        return courseService.getCourses(grade);
    }
}
