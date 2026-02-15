package com.maplewood.mapper;

import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.model.CourseSection;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Student;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
public class EnrollmentMapper {

    public EnrollmentResponseDTO toEnrollmentResponseDTO(@NonNull Enrollment enrollment, String semesterName) {
        return EnrollmentResponseDTO.builder()
                .enrollmentId(enrollment.getId())
                .studentName(enrollment.getStudent().getFirstName() + " "
                        + enrollment.getStudent().getLastName())
                .courseName(enrollment.getCourseSection().getCourse().getName())
                .semesterName(semesterName)
                .status("SUCCESS")
                .message("Successfully enrolled")
                .build();
    }

    public EnrollmentResponseDTO toErrorResponse(@NonNull Student student, @NonNull CourseSection section,
            String message) {
        return EnrollmentResponseDTO.builder()
                .studentName(student.getFirstName() + " " + student.getLastName())
                .courseName(section.getCourse().getName())
                .status("FAILED")
                .message(message)
                .build();
    }
}
