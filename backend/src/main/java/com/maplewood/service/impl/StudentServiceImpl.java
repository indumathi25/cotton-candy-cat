package com.maplewood.service.impl;

import com.maplewood.dto.*;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.mapper.StudentMapper;
import com.maplewood.model.*;
import com.maplewood.repository.*;
import com.maplewood.service.StudentService;
import com.maplewood.util.AcademicCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.function.Function;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Apply to all methods
public class StudentServiceImpl implements StudentService {

        private final StudentRepository studentRepository;
        private final CourseHistoryRepository courseHistoryRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final SemesterRepository semesterRepository;
        private final StudentMapper studentMapper;
        private final AcademicCalculator academicCalculator;

        @Override
        public StudentProfileDTO getStudentProfile(Long studentId) {
                Student student = fetchStudent(studentId);

                List<CourseHistory> history = courseHistoryRepository.findByStudentId(studentId);

                List<CourseHistory> passedCourses = history.stream()
                                .filter(ch -> CourseStatus.passed.equals(ch.getStatus()))
                                .toList();

                int creditsToGraduate = 22;
                double gpa = academicCalculator.calculateGPA(history);

                return studentMapper.toProfileDTO(student, passedCourses, creditsToGraduate, gpa);
        }

        @Override
        public StudentScheduleDTO getStudentSchedule(Long studentId) {
                Student student = fetchStudent(studentId);
                Semester activeSemester = fetchActiveSemester();

                List<Enrollment> enrollments = enrollmentRepository
                                .findByStudentIdAndCourseSection_SemesterId(studentId, activeSemester.getId());

                return studentMapper.toScheduleDTO(student, enrollments, activeSemester);
        }

        @Override
        public StudentCourseHistoryDTO getStudentCourseHistory(Long studentId) {
                Student student = fetchStudent(studentId);
                Semester activeSemester = fetchActiveSemester();

                List<CourseHistory> history = courseHistoryRepository.findByStudentId(studentId);
                List<Enrollment> enrollments = enrollmentRepository
                                .findByStudentIdAndCourseSection_SemesterId(studentId, activeSemester.getId());

                List<Long> completedIds = filterCourseIdsByStatus(history, CourseStatus.passed);
                List<Long> activeIds = enrollments.stream()
                                .map(e -> e.getCourseSection().getCourse().getId())
                                .toList();

                // Merge history and active enrollments into DTOs
                List<StudentEnrollmentDTO> allEnrollments = Stream.concat(
                                history.stream().map(ch -> mapToEnrollmentDTO(ch, ch.getStatus().name().toLowerCase())),
                                enrollments.stream().map(e -> mapToEnrollmentDTO(e, "active"))).toList();

                return StudentCourseHistoryDTO.builder()
                                .completedCourseIds(completedIds)
                                .activeCourseIds(activeIds)
                                .allEnrollments(allEnrollments)
                                .build();
        }

        // ---------------------- Private helpers ----------------------

        private Student fetchStudent(Long studentId) {
                return studentRepository.findById(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found with id: " + studentId));
        }

        private Semester fetchActiveSemester() {
                return semesterRepository.findByIsActiveTrue()
                                .orElseThrow(() -> new ResourceNotFoundException("No active semester found"));
        }

        private List<Long> filterCourseIdsByStatus(List<CourseHistory> history, CourseStatus status) {
                return history.stream()
                                .filter(ch -> status.equals(ch.getStatus()))
                                .map(ch -> ch.getCourse().getId())
                                .toList();
        }

        private StudentEnrollmentDTO mapToEnrollmentDTO(CourseHistory ch, String status) {
                return StudentEnrollmentDTO.builder()
                                .courseId(ch.getCourse().getId())
                                .courseName(ch.getCourse().getName())
                                .courseCode(ch.getCourse().getCode())
                                .semesterOrder(ch.getSemester().getOrderInYear())
                                .grade(ch.getGrade())
                                .credits(ch.getCourse().getCredits())
                                .status(status)
                                .build();
        }

        private StudentEnrollmentDTO mapToEnrollmentDTO(Enrollment e, String status) {
                CourseSection cs = e.getCourseSection();
                Course course = cs.getCourse();
                Semester semester = cs.getSemester();

                return StudentEnrollmentDTO.builder()
                                .courseId(course.getId())
                                .courseName(course.getName())
                                .courseCode(course.getCode())
                                .semesterOrder(semester.getOrderInYear())
                                .credits(course.getCredits())
                                .status(status)
                                .build();
        }
}
