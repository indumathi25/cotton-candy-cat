package com.maplewood.mapper;

import com.maplewood.dto.CourseGradeDTO;
import com.maplewood.dto.GradeReportDTO;
import com.maplewood.model.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GradeMapper {

    @Mapping(target = "enrollmentId", source = "enrollment.id")
    @Mapping(target = "courseCode", source = "enrollment.courseSection.course.code")
    @Mapping(target = "courseName", source = "enrollment.courseSection.course.name")
    @Mapping(target = "teacherName", expression = "java(enrollment.getCourseSection().getTeacher().getFirstName() + \" \" + enrollment.getCourseSection().getTeacher().getLastName())")
    @Mapping(target = "semester", source = "enrollment.courseSection.semester.name")
    @Mapping(target = "credits", constant = "1.0")
    @Mapping(target = "status", expression = "java(enrollment.getGrade() != null ? \"completed\" : \"enrolled\")")
    CourseGradeDTO toCourseGradeDTO(Enrollment enrollment);

    @Mapping(target = "studentId", source = "studentId")
    @Mapping(target = "studentName", source = "studentName")
    @Mapping(target = "gradeLevel", source = "gradeLevel")
    @Mapping(target = "overallGpa", source = "overallGpa")
    @Mapping(target = "totalCreditsEarned", source = "totalCreditsEarned")
    @Mapping(target = "totalCreditsAttempted", source = "totalCreditsAttempted")
    @Mapping(target = "courseGrades", source = "courseGrades")
    GradeReportDTO toGradeReportDTO(
            Long studentId,
            String studentName,
            Integer gradeLevel,
            Double overallGpa,
            Integer totalCreditsEarned,
            Integer totalCreditsAttempted,
            List<CourseGradeDTO> courseGrades);
}
