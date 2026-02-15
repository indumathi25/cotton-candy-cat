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
}
