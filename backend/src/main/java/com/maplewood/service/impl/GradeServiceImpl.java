package com.maplewood.service.impl;

import com.maplewood.dto.CourseGradeDTO;
import com.maplewood.dto.GradeReportDTO;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Student;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.StudentRepository;
import com.maplewood.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeServiceImpl implements GradeService {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final com.maplewood.mapper.GradeMapper gradeMapper;

    @Override
    @Transactional(readOnly = true)
    public GradeReportDTO getGradeReport(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);

        List<CourseGradeDTO> courseGrades = enrollments.stream()
                .map(gradeMapper::toCourseGradeDTO)
                .collect(Collectors.toList());

        // Calculate GPA
        double overallGpa = calculateGPA(enrollments);

        // Calculate credits
        int creditsEarned = (int) enrollments.stream()
                .filter(e -> e.getGrade() != null && !e.getGrade().equals("F"))
                .count();

        int creditsAttempted = enrollments.size();

        return gradeMapper.toGradeReportDTO(
                student.getId(),
                student.getFirstName() + " " + student.getLastName(),
                student.getGradeLevel(),
                overallGpa,
                creditsEarned,
                creditsAttempted,
                courseGrades);
    }

    private double calculateGPA(List<Enrollment> enrollments) {
        List<Enrollment> gradedEnrollments = enrollments.stream()
                .filter(e -> e.getGrade() != null)
                .collect(Collectors.toList());

        if (gradedEnrollments.isEmpty()) {
            return 0.0;
        }

        double totalPoints = gradedEnrollments.stream()
                .mapToDouble(e -> getGradePoints(e.getGrade()))
                .sum();

        return Math.round((totalPoints / gradedEnrollments.size()) * 100.0) / 100.0;
    }

    private double getGradePoints(String grade) {
        if (grade == null)
            return 0.0;

        return switch (grade.toUpperCase()) {
            case "A" -> 4.0;
            case "B" -> 3.0;
            case "C" -> 2.0;
            case "D" -> 1.0;
            case "F" -> 0.0;
            default -> 0.0;
        };
    }
}
