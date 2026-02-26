package com.maplewood.mapper;

import com.maplewood.dto.*;
import com.maplewood.model.CourseHistory;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Semester;
import com.maplewood.model.Student;
import com.maplewood.util.AcademicCalculator;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class StudentMapper {

        @Autowired
        protected AcademicCalculator academicCalculator;

        @Mapping(target = "id", source = "student.id")
        @Mapping(target = "fullName", expression = "java(student.getFirstName() + \" \" + student.getLastName())")
        @Mapping(target = "gradeLevel", source = "student.gradeLevel")
        @Mapping(target = "gpa", source = "gpa")
        @Mapping(target = "creditsEarned", expression = "java(academicCalculator.calculateCreditsEarned(passedCourses))")
        @Mapping(target = "creditsToGraduate", source = "creditsToGraduate")
        @Mapping(target = "remainingCredits", expression = "java(academicCalculator.calculateRemainingCredits(creditsToGraduate, academicCalculator.calculateCreditsEarned(passedCourses)))")
        @Mapping(target = "progressPercentage", expression = "java(academicCalculator.calculateProgress(creditsToGraduate, academicCalculator.calculateCreditsEarned(passedCourses)))")
        public abstract StudentProfileDTO toProfileDTO(Student student, List<CourseHistory> passedCourses,
                        int creditsToGraduate, double gpa);

        @Mapping(target = "studentId", source = "student.id")
        @Mapping(target = "studentName", expression = "java(student.getFirstName() + \" \" + student.getLastName())")
        @Mapping(target = "semesterName", expression = "java(semester == null ? \"N/A\" : semester.getName())")
        @Mapping(target = "schedule", source = "enrollments")
        public abstract StudentScheduleDTO toScheduleDTO(Student student, List<Enrollment> enrollments,
                        Semester semester);

        @Mapping(target = "courseName", source = "enrollment.courseSection.course.name")
        @Mapping(target = "courseCode", source = "enrollment.courseSection.course.code")
        @Mapping(target = "teacherName", expression = "java(enrollment.getCourseSection().getTeacher().getFirstName() + \" \" + enrollment.getCourseSection().getTeacher().getLastName())")
        @Mapping(target = "classroomId", source = "enrollment.courseSection.classroomId")
        @Mapping(target = "dayOfWeek", source = "enrollment.courseSection.timeSlot.dayOfWeek")
        @Mapping(target = "startTime", source = "enrollment.courseSection.timeSlot.startTime")
        @Mapping(target = "endTime", source = "enrollment.courseSection.timeSlot.endTime")
        protected abstract ScheduleItemDTO toScheduleItem(Enrollment enrollment);

        @Mapping(target = "courseId", source = "ch.course.id")
        @Mapping(target = "courseName", source = "ch.course.name")
        @Mapping(target = "courseCode", source = "ch.course.code")
        @Mapping(target = "semesterOrder", source = "ch.semester.orderInYear")
        @Mapping(target = "credits", source = "ch.course.credits")
        @Mapping(target = "status", source = "status")
        public abstract StudentEnrollmentDTO toEnrollmentDTO(CourseHistory ch, String status);

        @Mapping(target = "courseId", source = "e.courseSection.course.id")
        @Mapping(target = "courseName", source = "e.courseSection.course.name")
        @Mapping(target = "courseCode", source = "e.courseSection.course.code")
        @Mapping(target = "semesterOrder", source = "e.courseSection.semester.orderInYear")
        @Mapping(target = "credits", source = "e.courseSection.course.credits")
        @Mapping(target = "status", source = "status")
        public abstract StudentEnrollmentDTO toEnrollmentDTO(Enrollment e, String status);

        @Mapping(target = "completedCourseIds", source = "completedCourseIds")
        @Mapping(target = "activeCourseIds", source = "activeCourseIds")
        @Mapping(target = "allEnrollments", source = "allEnrollments")
        public abstract StudentCourseHistoryDTO toHistoryDTO(
                        List<Long> completedCourseIds,
                        List<Long> activeCourseIds,
                        List<StudentEnrollmentDTO> allEnrollments);
}
