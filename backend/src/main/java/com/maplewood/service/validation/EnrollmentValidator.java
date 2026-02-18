package com.maplewood.service.validation;

import com.maplewood.model.*;
import com.maplewood.repository.*;
import com.maplewood.util.PrerequisiteGraph;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Component responsible for all business validation rules related to course
 * enrollment.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EnrollmentValidator {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseHistoryRepository courseHistoryRepository;
    private final CourseRepository courseRepository;
    private final PrerequisiteGraph prerequisiteGraph;

    /**
     * Executes all enrollment validation rules.
     * 
     * @return Optional containing the error message if a rule is violated, or empty
     *         if valid.
     */
    public Optional<String> validate(Student student, CourseSection section, Semester activeSemester) {
        // 1. Semester Validation
        if (!section.getSemester().getId().equals(activeSemester.getId())) {
            return Optional.of("Section is not in the active semester");
        }

        // 2. Double Enrollment Check
        if (enrollmentRepository.existsByStudentIdAndCourseSectionId(student.getId(), section.getId())) {
            return Optional.of("Already enrolled in this section");
        }

        // Fetch current enrollments once to reuse across multiple checks
        List<Enrollment> currentEnrollments = enrollmentRepository
                .findByStudentIdAndCourseSection_SemesterId(student.getId(), activeSemester.getId());

        // 3. Max Courses Limit Check (Hardcoded limit: 5)
        if (currentEnrollments.size() >= 5) {
            return Optional.of("Maximum course limit (5) reached for this semester");
        }

        // 4. Grade Level Range Check
        Course course = section.getCourse();
        int grade = student.getGradeLevel();
        if (grade < course.getGradeLevelMin() || grade > course.getGradeLevelMax()) {
            return Optional.of("Student grade level " + grade + " is outside course range [" +
                    course.getGradeLevelMin() + "-" + course.getGradeLevelMax() + "]");
        }

        // 5. Section Capacity Check
        long currentCapacity = enrollmentRepository.countByCourseSection(section);
        if (currentCapacity >= section.getCapacity()) {
            return Optional.of("Course section is at full capacity");
        }

        // 6. Prerequisite Check (Recursive using DAG)
        if (course.getPrerequisiteId() != null) {
            prerequisiteGraph.buildGraph(courseRepository.findAll());
            List<Course> allPrereqs = prerequisiteGraph.getDeepPrerequisites(course.getId());

            for (Course prereq : allPrereqs) {
                if (!courseHistoryRepository.existsByStudentIdAndCourseIdAndStatus(student.getId(),
                        prereq.getId(), CourseStatus.passed)) {
                    return Optional.of("Missing prerequisite: " + prereq.getName() + " (" + prereq.getCode() + ")");
                }
            }
        }

        // 7. Time Conflict Check
        TimeSlot newSlot = section.getTimeSlot();
        for (Enrollment e : currentEnrollments) {
            if (hasTimeConflict(newSlot, e.getCourseSection().getTimeSlot())) {
                return Optional.of("Schedule conflict with course " + e.getCourseSection().getCourse().getName());
            }
        }

        return Optional.empty();
    }

    private boolean hasTimeConflict(TimeSlot t1, TimeSlot t2) {
        if (t1 == null || t2 == null)
            return false;
        if (!t1.getDayOfWeek().equals(t2.getDayOfWeek()))
            return false;

        // Simple overlap check: (StartA < EndB) && (EndA > StartB)
        return t1.getStartTime().compareTo(t2.getEndTime()) < 0 &&
                t1.getEndTime().compareTo(t2.getStartTime()) > 0;
    }
}
