package com.maplewood.service.impl;

import com.maplewood.dto.CourseDto;
import com.maplewood.dto.CourseSectionDto;
import com.maplewood.model.Course;
import com.maplewood.model.CourseSection;
import com.maplewood.model.Semester;
import com.maplewood.repository.CourseRepository;
import com.maplewood.repository.CourseSectionRepository;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.SemesterRepository;
import com.maplewood.service.CourseService;
import com.maplewood.mapper.CourseSectionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final SemesterRepository semesterRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseSectionMapper courseSectionMapper;

    @Override
    @Transactional(readOnly = true)
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

    @Override
    @Transactional(readOnly = true)
    public List<CourseSectionDto> getCourseSections(Long courseId) {
        Semester activeSemester = semesterRepository.findByIsActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active semester found"));

        List<CourseSection> sections = courseSectionRepository.findByCourseIdAndSemesterId(courseId,
                activeSemester.getId());

        return sections.stream()
                .map(section -> {
                    long enrolledCount = enrollmentRepository.countByCourseSection(section);
                    return courseSectionMapper.toDto(section, enrolledCount);
                })
                .collect(Collectors.toList());
    }

    private CourseDto toDto(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .code(course.getCode())
                .name(course.getName())
                .description(course.getDescription())
                .credits(course.getCredits())
                .gradeLevelMin(course.getGradeLevelMin())
                .gradeLevelMax(course.getGradeLevelMax())
                .hoursPerWeek(course.getHoursPerWeek())
                .semesterOrder(course.getSemesterOrder())
                .prerequisiteId(course.getPrerequisiteId())
                .build();
    }
}
