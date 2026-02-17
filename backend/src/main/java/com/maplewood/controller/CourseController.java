package com.maplewood.controller;

import com.maplewood.dto.CourseDto;
import com.maplewood.dto.CourseSectionDto;
import com.maplewood.dto.PageResponse;
import com.maplewood.service.CourseService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<PageResponse<CourseDto>> getCourses(
            @RequestParam(required = false) @Min(1) Integer grade,
            Pageable pageable) {

        PageResponse<CourseDto> response = PageResponse.of(courseService.getCourses(grade, pageable));

        return ResponseEntity.ok(response);
    }

    /**
     * Get all sections for a given course
     */
    @GetMapping("/{courseId}/sections")
    public ResponseEntity<List<CourseSectionDto>> getCourseSections(
            @PathVariable @Min(1) Long courseId) {

        return ResponseEntity.ok(courseService.getCourseSections(courseId));
    }
}
