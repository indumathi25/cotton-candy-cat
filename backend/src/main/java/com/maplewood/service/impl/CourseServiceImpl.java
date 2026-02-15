package com.maplewood.service.impl;

import com.maplewood.dto.CourseDto;
import com.maplewood.model.Course;
import com.maplewood.repository.CourseRepository;
import com.maplewood.service.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public org.springframework.data.domain.Page<CourseDto> getCourses(Integer grade,
            org.springframework.data.domain.Pageable pageable) {

        org.springframework.data.domain.Page<Course> courses;

        if (grade != null) {
            courses = courseRepository
                    .findByGradeLevelMinLessThanEqualAndGradeLevelMaxGreaterThanEqual(
                            grade, grade, pageable);
        } else {
            courses = courseRepository.findAll(pageable);
        }

        return courses.map(this::toDto);
    }

    private CourseDto toDto(Course course) {
        List<Long> prereqs = course.getPrerequisiteId() != null
                ? List.of(course.getPrerequisiteId())
                : List.of();

        return CourseDto.builder()
                .id(course.getId())
                .name(course.getName())
                .credits(course.getCredits())
                .minGrade(course.getGradeLevelMin())
                .maxGrade(course.getGradeLevelMax())
                .prerequisiteIds(prereqs)
                .build();
    }
}
