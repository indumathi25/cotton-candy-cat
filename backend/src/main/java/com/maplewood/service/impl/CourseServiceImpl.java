package com.maplewood.service.impl;

import com.maplewood.dto.CourseDto;
import com.maplewood.dto.CourseSectionDto;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.model.CourseSection;
import com.maplewood.model.Semester;
import com.maplewood.repository.CourseRepository;
import com.maplewood.repository.CourseSectionRepository;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.SemesterRepository;
import com.maplewood.service.CourseService;
import com.maplewood.mapper.CourseSectionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseServiceImpl implements CourseService {

        private final CourseRepository courseRepository;
        private final CourseSectionRepository courseSectionRepository;
        private final SemesterRepository semesterRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final CourseSectionMapper courseSectionMapper;
        private final com.maplewood.mapper.CourseMapper courseMapper;

        @Override
        public Page<CourseDto> getCourses(Integer grade, String search, Pageable pageable) {
                String searchPattern = (search != null && !search.trim().isEmpty())
                                ? "%" + search.toLowerCase() + "%"
                                : null;
                Page<com.maplewood.model.Course> courses = courseRepository.findByFilters(grade, searchPattern,
                                pageable);
                return courses.map(courseMapper::toDto);
        }

        @Override
        public List<CourseSectionDto> getCourseSections(Long courseId) {
                Semester activeSemester = semesterRepository.findByIsActiveTrue()
                                .orElseThrow(() -> new ResourceNotFoundException("No active semester found"));

                List<CourseSection> sections = courseSectionRepository
                                .findByCourseIdAndSemesterId(courseId, activeSemester.getId());

                // Fetch all enrollment counts in one query to avoid N+1
                List<Object[]> results = enrollmentRepository.countEnrollmentsBySectionIds(
                                sections.stream().map(cs -> cs.getId()).toList());

                Map<Long, Long> enrollmentCounts = results.stream()
                                .collect(Collectors.toMap(
                                                row -> (Long) row[0],
                                                row -> (Long) row[1]));

                return sections.stream()
                                .map(section -> courseSectionMapper.toDto(
                                                section,
                                                enrollmentCounts.getOrDefault(section.getId(), 0L)))
                                .collect(Collectors.toList());
        }
}
