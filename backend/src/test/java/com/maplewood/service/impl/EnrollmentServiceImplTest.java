package com.maplewood.service.impl;

import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.mapper.EnrollmentMapper;
import com.maplewood.model.*;
import com.maplewood.repository.*;
import com.maplewood.service.validation.EnrollmentValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EnrollmentServiceImplTest {

        @Mock
        private EnrollmentRepository enrollmentRepository;
        @Mock
        private StudentRepository studentRepository;
        @Mock
        private CourseSectionRepository courseSectionRepository;
        @Mock
        private SemesterRepository semesterRepository;
        @Mock
        private EnrollmentMapper enrollmentMapper;
        @Mock
        private EnrollmentValidator enrollmentValidator;

        @InjectMocks
        private EnrollmentServiceImpl enrollmentService;

        private Student student;
        private CourseSection section;
        private Semester activeSemester;
        private EnrollmentRequestDTO request;

        @BeforeEach
        void setUp() {
                student = new Student();
                student.setId(1L);
                student.setFirstName("John");
                student.setLastName("Doe");
                student.setGradeLevel(9);

                activeSemester = new Semester();
                activeSemester.setId(1L);
                activeSemester.setName("Fall 2024");
                activeSemester.setIsActive(true);

                Course course = new Course();
                course.setId(10L);
                course.setName("Algebra I");

                section = new CourseSection();
                section.setId(1L);
                section.setCourse(course);
                section.setSemester(activeSemester);

                request = new EnrollmentRequestDTO(1L, 1L);
        }

        @Test
        void testEnrollStudent_StudentNotFound() {
                when(studentRepository.findById(1L)).thenReturn(Optional.empty());

                assertThrows(ResourceNotFoundException.class, () -> enrollmentService.enrollStudent(request));
        }

        @Test
        void testEnrollStudent_SectionNotFound() {
                when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
                when(courseSectionRepository.findById(1L)).thenReturn(Optional.empty());

                assertThrows(ResourceNotFoundException.class, () -> enrollmentService.enrollStudent(request));
        }

        @Test
        void testEnrollStudent_Success() {
                // Arrange
                when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
                when(courseSectionRepository.findById(1L)).thenReturn(Optional.of(section));
                when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(activeSemester));

                // Validator returns empty (no errors)
                when(enrollmentValidator.validate(student, section, activeSemester)).thenReturn(Optional.empty());

                Enrollment savedEnrollment = new Enrollment();
                savedEnrollment.setId(100L);
                savedEnrollment.setStudent(student);
                savedEnrollment.setCourseSection(section);
                when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(savedEnrollment);

                EnrollmentResponseDTO expectedResponse = EnrollmentResponseDTO.builder()
                                .status("SUCCESS")
                                .message("Successfully enrolled")
                                .build();
                when(enrollmentMapper.toEnrollmentResponseDTO(any(Enrollment.class), anyString()))
                                .thenReturn(expectedResponse);

                // Act
                EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

                // Assert
                assertEquals("SUCCESS", response.getStatus());
                verify(enrollmentRepository, times(1)).save(any(Enrollment.class));
        }

        @Test
        void testEnrollStudent_ValidationError() {
                // Arrange
                when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
                when(courseSectionRepository.findById(1L)).thenReturn(Optional.of(section));
                when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(activeSemester));

                // Validator returns an error
                String errorMsg = "Maximum course limit reached";
                when(enrollmentValidator.validate(student, section, activeSemester)).thenReturn(Optional.of(errorMsg));

                EnrollmentResponseDTO errorResponse = EnrollmentResponseDTO.builder()
                                .status("FAILED")
                                .message(errorMsg)
                                .build();
                when(enrollmentMapper.toErrorResponse(student, section, errorMsg)).thenReturn(errorResponse);

                // Act
                EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

                // Assert
                assertEquals("FAILED", response.getStatus());
                assertEquals(errorMsg, response.getMessage());
                verify(enrollmentRepository, never()).save(any());
        }
}
