package com.maplewood.mapper;

import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.model.CourseSection;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {

        @Mapping(target = "enrollmentId", source = "enrollment.id")
        @Mapping(target = "studentName", expression = "java(enrollment.getStudent().getFirstName() + \" \" + enrollment.getStudent().getLastName())")
        @Mapping(target = "courseName", source = "enrollment.courseSection.course.name")
        @Mapping(target = "semesterName", source = "semesterName")
        @Mapping(target = "status", constant = "SUCCESS")
        @Mapping(target = "message", constant = "Successfully enrolled")
        EnrollmentResponseDTO toEnrollmentResponseDTO(Enrollment enrollment, String semesterName);

        @Mapping(target = "studentName", expression = "java(student.getFirstName() + \" \" + student.getLastName())")
        @Mapping(target = "courseName", source = "section.course.name")
        @Mapping(target = "status", constant = "FAILED")
        @Mapping(target = "message", source = "message")
        @Mapping(target = "enrollmentId", ignore = true)
        @Mapping(target = "semesterName", ignore = true)
        EnrollmentResponseDTO toErrorResponse(Student student, CourseSection section, String message);
}
