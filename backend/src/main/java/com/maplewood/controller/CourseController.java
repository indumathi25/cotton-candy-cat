package com.maplewood.controller;

import com.maplewood.dto.CourseDto;
import com.maplewood.dto.CourseSectionDto;
import com.maplewood.dto.PageResponse;
import com.maplewood.service.CourseService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    /**
     * Get paginated list of courses (optionally filtered by grade)
     */
    @GetMapping
    public PageResponse<CourseDto> getCourses(
            @RequestParam(required = false) @Min(1) Integer grade,
            @RequestParam(required = false) String search,
            Pageable pageable) {

        return PageResponse.of(courseService.getCourses(grade, search, pageable));
    }

    /**
     * Get all sections for a given course
     */
    @GetMapping("/{courseId}/sections")
    public List<CourseSectionDto> getCourseSections(
            @PathVariable @Min(1) Long courseId) {

        return courseService.getCourseSections(courseId);
    }
}
