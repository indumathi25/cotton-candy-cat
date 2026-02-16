package com.maplewood.service.impl;

import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.dto.StudentScheduleDTO;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.mapper.StudentMapper;
import com.maplewood.model.CourseHistory;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Semester;
import com.maplewood.model.Student;
import com.maplewood.repository.CourseHistoryRepository;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.SemesterRepository;
import com.maplewood.repository.StudentRepository;
import com.maplewood.service.StudentService;
import com.maplewood.util.AcademicCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

        private final StudentRepository studentRepository;
        private final CourseHistoryRepository courseHistoryRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final SemesterRepository semesterRepository;
        private final StudentMapper studentMapper;
        private final AcademicCalculator academicCalculator;

        @Override
        @org.springframework.transaction.annotation.Transactional(readOnly = true)
        public StudentProfileDTO getStudentProfile(@NonNull Long id) {
                Student student = studentRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

                List<CourseHistory> history = courseHistoryRepository.findByStudent(student);

                // Filter for passed courses for GPA and credit calculation
                List<CourseHistory> passedCourses = history.stream()
                                .filter(ch -> "passed".equalsIgnoreCase(ch.getStatus()))
                                .collect(Collectors.toList());

                // Standard requirement: 22 credits to graduate (example value)
                int creditsToGraduate = 22;

                double gpa = academicCalculator.calculateGPA(passedCourses);

                return studentMapper.toProfileDTO(student, passedCourses, creditsToGraduate, gpa);
        }

        @Override
        @org.springframework.transaction.annotation.Transactional(readOnly = true)
        public StudentScheduleDTO getStudentSchedule(@NonNull Long studentId) {
                Student student = studentRepository.findById(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found with id: " + studentId));

                Semester activeSemester = semesterRepository.findByIsActiveTrue()
                                .orElseThrow(() -> new ResourceNotFoundException("No active semester found"));

                List<Enrollment> enrollments = enrollmentRepository.findByStudentAndSemester(student, activeSemester);

                return studentMapper.toScheduleDTO(student, enrollments, activeSemester);
        }

        @Override
        @org.springframework.transaction.annotation.Transactional(readOnly = true)
        public com.maplewood.dto.StudentCourseHistoryDTO getStudentCourseHistory(@NonNull Long studentId) {
                Student student = studentRepository.findById(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found with id: " + studentId));

                List<CourseHistory> history = courseHistoryRepository.findByStudent(student);

                List<Long> completedIds = history.stream()
                                .filter(ch -> "passed".equalsIgnoreCase(ch.getStatus()))
                                .map(ch -> ch.getCourse().getId())
                                .collect(Collectors.toList());

                // Get active enrollments
                Semester activeSemester = semesterRepository.findByIsActiveTrue()
                                .orElseThrow(() -> new ResourceNotFoundException("No active semester found"));

                List<Enrollment> enrollments = enrollmentRepository.findByStudentAndSemester(student, activeSemester);

                List<Long> activeIds = enrollments.stream()
                                .map(e -> e.getCourseSection().getCourse().getId())
                                .collect(Collectors.toList());

                List<com.maplewood.dto.StudentEnrollmentDTO> allEnrollments = history.stream()
                                .map(ch -> com.maplewood.dto.StudentEnrollmentDTO.builder()
                                                .courseId(ch.getCourse().getId())
                                                .courseName(ch.getCourse().getName())
                                                .courseCode(ch.getCourse().getCode())
                                                .semesterOrder(ch.getSemester().getOrderInYear())
                                                .status(ch.getStatus())
                                                .build())
                                .collect(Collectors.toList());

                // Add active enrollments to allEnrollments as 'active'
                allEnrollments.addAll(enrollments.stream()
                                .map(e -> com.maplewood.dto.StudentEnrollmentDTO.builder()
                                                .courseId(e.getCourseSection().getCourse().getId())
                                                .courseName(e.getCourseSection().getCourse().getName())
                                                .courseCode(e.getCourseSection().getCourse().getCode())
                                                .semesterOrder(e.getCourseSection().getSemester().getOrderInYear())
                                                .status("active")
                                                .build())
                                .collect(Collectors.toList()));

                return com.maplewood.dto.StudentCourseHistoryDTO.builder()
                                .completedCourseIds(completedIds)
                                .activeCourseIds(activeIds)
                                .allEnrollments(allEnrollments)
                                .build();
        }
}
