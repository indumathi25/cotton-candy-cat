package com.maplewood.service.impl;

import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.mapper.EnrollmentMapper;
import com.maplewood.model.*;
import com.maplewood.repository.*;
import com.maplewood.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
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
        log.info("Attempting to enroll student {} in section {}", request.getStudentId(), request.getCourseSectionId());

        // Fetch core entities
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        CourseSection section = courseSectionRepository.findById(request.getCourseSectionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course section not found with id: " + request.getCourseSectionId()));

        Semester activeSemester = semesterRepository.findByIsActiveTrue()
                .orElseThrow(() -> new ResourceNotFoundException("No active semester found"));

        long studentId = student.getId();
        long sectionId = section.getId();
        long semesterId = activeSemester.getId();
        Course course = section.getCourse();

        log.debug("Found student: {} {}, section: {}, course: {}", student.getFirstName(), student.getLastName(),
                sectionId, course.getName());

        // 1️⃣ Semester Validation
        if (!section.getSemester().getId().equals(semesterId)) {
            log.warn("Semester mismatch: section.semester={}, activeSemester={}", section.getSemester().getId(),
                    semesterId);
            return enrollmentMapper.toErrorResponse(student, section, "Section is not in the active semester");
        }

        // 2️⃣ Already enrolled?
        if (enrollmentRepository.existsByStudentIdAndCourseSectionId(studentId, sectionId)) {
            log.warn("Student {} already enrolled in section {}", studentId, sectionId);
            return enrollmentMapper.toErrorResponse(student, section, "Already enrolled in this section");
        }

        // 3️⃣ Fetch all current enrollments once
        List<Enrollment> currentEnrollments = enrollmentRepository
                .findByStudentIdAndCourseSection_SemesterId(studentId, semesterId);

        // 4️⃣ Max courses check
        if (currentEnrollments.size() >= 5) {
            log.warn("Student {} reached max enrollment limit (5)", studentId);
            return enrollmentMapper.toErrorResponse(student, section,
                    "Maximum course limit (5) reached for this semester");
        }

        // 5️⃣ Grade level check
        int grade = student.getGradeLevel();
        if (grade < course.getGradeLevelMin() || grade > course.getGradeLevelMax()) {
            log.warn("Grade level mismatch: studentGrade={}, courseRange=[{}-{}]", grade, course.getGradeLevelMin(),
                    course.getGradeLevelMax());
            return enrollmentMapper.toErrorResponse(student, section,
                    "Student grade level " + grade + " is outside course range [" +
                            course.getGradeLevelMin() + "-" + course.getGradeLevelMax() + "]");
        }

        // 6️⃣ Capacity check
        long currentCapacity = enrollmentRepository.countByCourseSection(section);
        if (currentCapacity >= section.getCapacity()) {
            log.warn("Section {} is at full capacity: current={}, max={}", sectionId, currentCapacity,
                    section.getCapacity());
            return enrollmentMapper.toErrorResponse(student, section, "Course section is at full capacity");
        }

        // 7️⃣ Prerequisite check
        if (course.getPrerequisiteId() != null &&
                !courseHistoryRepository.existsByStudentIdAndCourseIdAndStatus(studentId,
                        course.getPrerequisiteId(), CourseStatus.passed)) {
            log.warn("Prerequisite not met: studentId={}, prerequisiteId={}", studentId, course.getPrerequisiteId());
            return enrollmentMapper.toErrorResponse(student, section,
                    "Missing prerequisite course id: " + course.getPrerequisiteId());
        }

        // 8️⃣ Time conflict check
        TimeSlot newSlot = section.getTimeSlot();
        currentEnrollments.stream()
                .map(e -> e.getCourseSection().getTimeSlot())
                .filter(existingSlot -> hasTimeConflict(newSlot, existingSlot))
                .findFirst()
                .ifPresent(conflict -> {
                    log.warn("Schedule conflict detected for student {}", studentId);
                    throw new IllegalArgumentException(
                            "Schedule conflict with course " + currentEnrollments.stream()
                                    .filter(e -> hasTimeConflict(newSlot, e.getCourseSection().getTimeSlot()))
                                    .findFirst()
                                    .get()
                                    .getCourseSection()
                                    .getCourse()
                                    .getName());
                });

        // ✅ Save enrollment
        try {
            Enrollment enrollment = new Enrollment();
            enrollment.setStudent(student);
            enrollment.setCourseSection(section);
            Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
            log.info("Successfully enrolled student {} in section {}", studentId, sectionId);
            return enrollmentMapper.toEnrollmentResponseDTO(savedEnrollment, activeSemester.getName());
        } catch (Exception e) {
            log.error("Failed to save enrollment for student {} in section {}", studentId, sectionId, e);
            throw e;
        }
    }

    // ---------------- Private helpers ----------------

    private boolean hasTimeConflict(TimeSlot t1, TimeSlot t2) {
        if (t1 == null || t2 == null)
            return false;
        if (!t1.getDayOfWeek().equals(t2.getDayOfWeek()))
            return false;
        return t1.getStartTime().compareTo(t2.getEndTime()) < 0 &&
                t1.getEndTime().compareTo(t2.getStartTime()) > 0;
    }
}
