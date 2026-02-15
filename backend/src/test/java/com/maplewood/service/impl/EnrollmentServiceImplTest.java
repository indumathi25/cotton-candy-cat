package com.maplewood.service.impl;

import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.mapper.EnrollmentMapper;
import com.maplewood.model.*;
import com.maplewood.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
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
    private CourseHistoryRepository courseHistoryRepository;
    @Mock
    private EnrollmentMapper enrollmentMapper;

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
        course.setId(1L);
        course.setName("English I");
        course.setGradeLevelMin(9);
        course.setGradeLevelMax(10);

        TimeSlot timeSlot = new TimeSlot(1L, "MONDAY", "08:00", "09:00");

        section = new CourseSection();
        section.setId(1L);
        section.setCourse(course);
        section.setSemester(activeSemester);
        section.setTimeSlot(timeSlot);
        section.setCapacity(30);

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
        when(enrollmentRepository.existsByStudentAndCourseSection(student, section)).thenReturn(false);
        when(enrollmentRepository.countByStudentAndSemester(student, activeSemester)).thenReturn(0L);
        when(enrollmentRepository.countByCourseSection(section)).thenReturn(0L);
        when(enrollmentRepository.findByStudentAndSemester(student, activeSemester))
                .thenReturn(Collections.emptyList());

        Enrollment savedEnrollment = new Enrollment();
        savedEnrollment.setId(100L);
        savedEnrollment.setStudent(student);
        savedEnrollment.setCourseSection(section);
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(savedEnrollment);

        EnrollmentResponseDTO expectedResponse = EnrollmentResponseDTO.builder()
                .status("SUCCESS")
                .message("Successfully enrolled")
                .build();
        when(enrollmentMapper.toEnrollmentResponseDTO(any(Enrollment.class), anyString())).thenReturn(expectedResponse);

        // Act
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

        // Assert
        assertEquals("SUCCESS", response.getStatus());
        verify(enrollmentRepository, times(1)).save(any(Enrollment.class));
    }

    @Test
    void testEnrollStudent_DoubleEnrollment() {
        // Arrange
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(1L)).thenReturn(Optional.of(section));
        when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(activeSemester));
        when(enrollmentRepository.existsByStudentAndCourseSection(student, section)).thenReturn(true);

        EnrollmentResponseDTO errorResponse = EnrollmentResponseDTO.builder()
                .status("FAILED")
                .message("Already enrolled in this section")
                .build();
        when(enrollmentMapper.toErrorResponse(any(), any(), anyString())).thenReturn(errorResponse);

        // Act
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

        // Assert
        assertEquals("FAILED", response.getStatus());
        assertEquals("Already enrolled in this section", response.getMessage());
        verify(enrollmentRepository, never()).save(any());
    }

    @Test
    void testEnrollStudent_MaxCoursesReached() {
        // Arrange
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(1L)).thenReturn(Optional.of(section));
        when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(activeSemester));
        when(enrollmentRepository.existsByStudentAndCourseSection(student, section)).thenReturn(false);
        when(enrollmentRepository.countByStudentAndSemester(student, activeSemester)).thenReturn(5L);

        EnrollmentResponseDTO errorResponse = EnrollmentResponseDTO.builder()
                .status("FAILED")
                .message("Maximum course limit (5) reached for this semester")
                .build();
        when(enrollmentMapper.toErrorResponse(any(), any(), anyString())).thenReturn(errorResponse);

        // Act
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

        // Assert
        assertEquals("FAILED", response.getStatus());
        assertTrue(response.getMessage().contains("Maximum course limit"));
    }

    @Test
    void testEnrollStudent_GradeLevelMismatch() {
        // Arrange
        student.setGradeLevel(12); // Outside range [9, 10]
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(1L)).thenReturn(Optional.of(section));
        when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(activeSemester));
        when(enrollmentRepository.existsByStudentAndCourseSection(student, section)).thenReturn(false);
        when(enrollmentRepository.countByStudentAndSemester(student, activeSemester)).thenReturn(0L);

        EnrollmentResponseDTO errorResponse = EnrollmentResponseDTO.builder()
                .status("FAILED")
                .message("Student grade level 12 is outside course range [9-10]")
                .build();
        when(enrollmentMapper.toErrorResponse(any(), any(), anyString())).thenReturn(errorResponse);

        // Act
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

        // Assert
        assertEquals("FAILED", response.getStatus());
        assertTrue(response.getMessage().contains("grade level"));
    }

    @Test
    void testEnrollStudent_NotActiveSemester() {
        // Arrange
        Semester inactiveSemester = new Semester();
        inactiveSemester.setId(2L);
        inactiveSemester.setIsActive(false);
        section.setSemester(inactiveSemester);

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(1L)).thenReturn(Optional.of(section));
        when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(activeSemester));

        EnrollmentResponseDTO errorResponse = EnrollmentResponseDTO.builder()
                .status("FAILED")
                .message("Section is not in the active semester")
                .build();
        when(enrollmentMapper.toErrorResponse(any(), any(), anyString())).thenReturn(errorResponse);

        // Act
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

        // Assert
        assertEquals("FAILED", response.getStatus());
        assertEquals("Section is not in the active semester", response.getMessage());
    }

    @Test
    void testEnrollStudent_CapacityFull() {
        // Arrange
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(1L)).thenReturn(Optional.of(section));
        when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(activeSemester));
        when(enrollmentRepository.existsByStudentAndCourseSection(student, section)).thenReturn(false);
        when(enrollmentRepository.countByStudentAndSemester(student, activeSemester)).thenReturn(0L);
        when(enrollmentRepository.countByCourseSection(section)).thenReturn(30L); // Max capacity is 30

        EnrollmentResponseDTO errorResponse = EnrollmentResponseDTO.builder()
                .status("FAILED")
                .message("Course section is at full capacity")
                .build();
        when(enrollmentMapper.toErrorResponse(any(), any(), anyString())).thenReturn(errorResponse);

        // Act
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

        // Assert
        assertEquals("FAILED", response.getStatus());
        assertEquals("Course section is at full capacity", response.getMessage());
    }

    @Test
    void testEnrollStudent_MissingPrerequisite() {
        // Arrange
        section.getCourse().setPrerequisiteId(5L);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(1L)).thenReturn(Optional.of(section));
        when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(activeSemester));
        when(enrollmentRepository.existsByStudentAndCourseSection(student, section)).thenReturn(false);
        when(enrollmentRepository.countByStudentAndSemester(student, activeSemester)).thenReturn(0L);
        when(enrollmentRepository.countByCourseSection(section)).thenReturn(0L);
        when(courseHistoryRepository.existsByStudentAndCourseIdAndStatus(student, 5L, "passed")).thenReturn(false);

        EnrollmentResponseDTO errorResponse = EnrollmentResponseDTO.builder()
                .status("FAILED")
                .message("Missing prerequisite: 5")
                .build();
        when(enrollmentMapper.toErrorResponse(any(), any(), anyString())).thenReturn(errorResponse);

        // Act
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

        // Assert
        assertEquals("FAILED", response.getStatus());
        assertTrue(response.getMessage().contains("Missing prerequisite"));
    }

    @Test
    void testEnrollStudent_TimeConflict() {
        // Arrange
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(1L)).thenReturn(Optional.of(section));
        when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(activeSemester));
        when(enrollmentRepository.existsByStudentAndCourseSection(student, section)).thenReturn(false);
        when(enrollmentRepository.countByStudentAndSemester(student, activeSemester)).thenReturn(1L);
        when(enrollmentRepository.countByCourseSection(section)).thenReturn(0L);

        // Existing enrollment at the same time
        Enrollment existingEnrollment = new Enrollment();
        CourseSection existingSection = new CourseSection();
        existingSection.setCourse(new Course());
        existingSection.getCourse().setName("History");
        existingSection.setTimeSlot(new TimeSlot(2L, "MONDAY", "08:30", "09:30")); // Overlaps with 08:00-09:00
        existingEnrollment.setCourseSection(existingSection);

        when(enrollmentRepository.findByStudentAndSemester(student, activeSemester))
                .thenReturn(Collections.singletonList(existingEnrollment));

        EnrollmentResponseDTO errorResponse = EnrollmentResponseDTO.builder()
                .status("FAILED")
                .message("Schedule conflict with History")
                .build();
        when(enrollmentMapper.toErrorResponse(any(), any(), anyString())).thenReturn(errorResponse);

        // Act
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

        // Assert
        assertEquals("FAILED", response.getStatus());
        assertTrue(response.getMessage().contains("Schedule conflict"));
    }
}
