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
    public List<CourseDto> getCourses(Integer grade) {

        List<Course> courses;

        if (grade != null) {
            courses = courseRepository
                    .findByGradeLevelMinLessThanEqualAndGradeLevelMaxGreaterThanEqual(
                            grade, grade);
        } else {
            courses = courseRepository.findAll();
        }

        return courses.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private CourseDto toDto(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .name(course.getName())
                .credits(course.getCredits())
                .minGrade(course.getGradeLevelMin())
                .maxGrade(course.getGradeLevelMax())
                .prerequisiteIds(List.of()) // populated later
                .build();
    }
}
