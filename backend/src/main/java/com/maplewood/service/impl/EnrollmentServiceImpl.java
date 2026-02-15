package com.maplewood.service.impl;

import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.mapper.EnrollmentMapper;
import com.maplewood.model.*;
import com.maplewood.repository.*;
import com.maplewood.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final SemesterRepository semesterRepository;
    private final CourseHistoryRepository courseHistoryRepository;
    private final EnrollmentMapper enrollmentMapper;

    @Override
    @Transactional
    public EnrollmentResponseDTO enrollStudent(EnrollmentRequestDTO request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        CourseSection section = courseSectionRepository.findById(request.getCourseSectionId())
                .orElseThrow(() -> new RuntimeException("Course section not found"));

        Semester activeSemester = semesterRepository.findByIsActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active semester found"));

        // 1. Semester Validation
        if (!section.getSemester().getId().equals(activeSemester.getId())) {
            return enrollmentMapper.toErrorResponse(student, section, "Section is not in the active semester");
        }

        // 2. Double Enrollment Check
        if (enrollmentRepository.existsByStudentAndCourseSection(student, section)) {
            return enrollmentMapper.toErrorResponse(student, section, "Already enrolled in this section");
        }

        // 3. Max Courses Check (Max 5)
        long currentEnrollmentCount = enrollmentRepository.countByStudentAndSemester(student, activeSemester);
        if (currentEnrollmentCount >= 5) {
            return enrollmentMapper.toErrorResponse(student, section,
                    "Maximum course limit (5) reached for this semester");
        }

        // 4. Grade Level Check
        Course course = section.getCourse();
        if (student.getGradeLevel() < course.getGradeLevelMin()
                || student.getGradeLevel() > course.getGradeLevelMax()) {
            return enrollmentMapper.toErrorResponse(student, section, "Student grade level " + student.getGradeLevel() +
                    " is outside course range [" + course.getGradeLevelMin() + "-" + course.getGradeLevelMax() + "]");
        }

        // 5. Capacity Check
        long sectionEnrollmentCount = enrollmentRepository.countByCourseSection(section);
        if (sectionEnrollmentCount >= section.getCapacity()) {
            return enrollmentMapper.toErrorResponse(student, section, "Course section is at full capacity");
        }

        // 6. Prerequisite Check
        if (course.getPrerequisiteId() != null) {
            boolean hasPassedPrereq = courseHistoryRepository.existsByStudentAndCourseIdAndStatus(student,
                    course.getPrerequisiteId(), "passed");
            if (!hasPassedPrereq) {
                return enrollmentMapper.toErrorResponse(student, section,
                        "Missing prerequisite: " + course.getPrerequisiteId());
            }
        }

        // 7. Time Conflict Check
        List<Enrollment> currentEnrollments = enrollmentRepository.findByStudentAndSemester(student, activeSemester);
        TimeSlot newTimeSlot = section.getTimeSlot();
        for (Enrollment existing : currentEnrollments) {
            TimeSlot existingTimeSlot = existing.getCourseSection().getTimeSlot();
            if (hasTimeConflict(newTimeSlot, existingTimeSlot)) {
                return enrollmentMapper.toErrorResponse(student, section,
                        "Schedule conflict with " + existing.getCourseSection().getCourse().getName());
            }
        }

        // Save Enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourseSection(section);
        enrollment.setEnrollmentDate(LocalDateTime.now());
        enrollment = enrollmentRepository.save(enrollment);

        return enrollmentMapper.toEnrollmentResponseDTO(enrollment, activeSemester.getName());
    }

    private boolean hasTimeConflict(TimeSlot t1, TimeSlot t2) {
        if (!t1.getDayOfWeek().equals(t2.getDayOfWeek())) {
            return false;
        }
        // Conflict if: start1 < end2 AND end1 > start2
        // Assuming times are in HH:MM format since they are Strings now
        return t1.getStartTime().compareTo(t2.getEndTime()) < 0 &&
                t1.getEndTime().compareTo(t2.getStartTime()) > 0;
    }
}
