package com.maplewood.service.impl;

import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.mapper.EnrollmentMapper;
import com.maplewood.model.CourseSection;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Semester;
import com.maplewood.model.Student;
import com.maplewood.repository.CourseSectionRepository;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.SemesterRepository;
import com.maplewood.repository.StudentRepository;
import com.maplewood.service.EnrollmentService;
import com.maplewood.service.validation.EnrollmentValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentServiceImpl implements EnrollmentService {

        private final EnrollmentRepository enrollmentRepository;
        private final StudentRepository studentRepository;
        private final CourseSectionRepository courseSectionRepository;
        private final SemesterRepository semesterRepository;
        private final EnrollmentMapper enrollmentMapper;
        private final EnrollmentValidator enrollmentValidator;

        @Override
        @Transactional
        public EnrollmentResponseDTO enrollStudent(EnrollmentRequestDTO request) {
                log.info("Attempting to enroll student {} in section {}", request.getStudentId(),
                                request.getCourseSectionId());

                Student student = fetchStudent(request.getStudentId());
                CourseSection section = fetchCourseSection(request.getCourseSectionId());
                Semester activeSemester = fetchActiveSemester();

                // Delegate all validation business rules to the validator
                Optional<String> validationError = enrollmentValidator.validate(student, section, activeSemester);

                if (validationError.isPresent()) {
                        return enrollmentMapper.toErrorResponse(student, section, validationError.get());
                }

                return createAndSaveEnrollment(student, section, activeSemester);
        }

        // ---------------- Private helper methods ----------------

        private Student fetchStudent(Long studentId) {
                return studentRepository.findById(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found with id: " + studentId));
        }

        private CourseSection fetchCourseSection(Long sectionId) {
                return courseSectionRepository.findById(sectionId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Course section not found with id: " + sectionId));
        }

        private Semester fetchActiveSemester() {
                return semesterRepository.findByIsActiveTrue()
                                .orElseThrow(() -> new ResourceNotFoundException("No active semester found"));
        }

        private EnrollmentResponseDTO createAndSaveEnrollment(Student student, CourseSection section,
                        Semester semester) {
                try {
                        Enrollment enrollment = new Enrollment();
                        enrollment.setStudent(student);
                        enrollment.setCourseSection(section);

                        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
                        log.info("Successfully enrolled student {} in section {}", student.getId(), section.getId());

                        return enrollmentMapper.toEnrollmentResponseDTO(savedEnrollment, semester.getName());
                } catch (Exception e) {
                        log.error("Failed to save enrollment for student {} in section {}", student.getId(),
                                        section.getId(), e);
                        throw e;
                }
        }
}
