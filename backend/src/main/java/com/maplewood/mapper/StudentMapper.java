package com.maplewood.mapper;

import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.model.CourseHistory;
import com.maplewood.model.Student;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StudentMapper {

    public StudentProfileDTO toProfileDTO(@NonNull Student student, List<CourseHistory> passedCourses,
            int creditsToGraduate) {
        int creditsEarned = (int) passedCourses.stream()
                .mapToDouble(ch -> ch.getCourse().getCredits())
                .sum();

        int remainingCredits = Math.max(0, creditsToGraduate - creditsEarned);
        double progressPercentage = (double) creditsEarned / creditsToGraduate * 100;

        return StudentProfileDTO.builder()
                .id(student.getId())
                .fullName(student.getFirstName() + " " + student.getLastName())
                .gradeLevel(student.getGradeLevel())
                .gpa(0.0) // GPA calculation requires letter grade mapping, set to 0.0 for now
                .creditsEarned(creditsEarned)
                .creditsToGraduate(creditsToGraduate)
                .remainingCredits(remainingCredits)
                .progressPercentage(progressPercentage)
                .build();
    }
}
