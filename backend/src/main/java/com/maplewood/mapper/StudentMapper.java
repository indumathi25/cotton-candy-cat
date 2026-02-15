package com.maplewood.mapper;

import com.maplewood.dto.ScheduleItemDTO;
import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.dto.StudentScheduleDTO;
import com.maplewood.model.CourseHistory;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Semester;
import com.maplewood.model.Student;
import com.maplewood.util.AcademicCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class StudentMapper {

        private final AcademicCalculator academicCalculator;

        public StudentProfileDTO toProfileDTO(
                        @NonNull Student student,
                        List<CourseHistory> passedCourses,
                        int creditsToGraduate,
                        double gpa) {
                // total credits the student has already earned
                // total credits the student has already earned
                int creditsEarned = academicCalculator.calculateCreditsEarned(passedCourses);
                // how many credits are still needed to graduate
                int remainingCredits = academicCalculator.calculateRemainingCredits(creditsToGraduate, creditsEarned);

                double progressPercentage = academicCalculator.calculateProgress(creditsToGraduate, creditsEarned);

                return StudentProfileDTO.builder()
                                .id(student.getId())
                                .fullName("%s %s".formatted(
                                                student.getFirstName(),
                                                student.getLastName()))
                                .gradeLevel(student.getGradeLevel())
                                .gpa(gpa)
                                .creditsEarned(creditsEarned)
                                .creditsToGraduate(creditsToGraduate)
                                .remainingCredits(remainingCredits)
                                .progressPercentage(progressPercentage)
                                .build();
        }

        public StudentScheduleDTO toScheduleDTO(
                        @NonNull Student student,
                        List<Enrollment> enrollments,
                        Semester semester) {
                var scheduleItems = enrollments.stream()
                                .map(this::toScheduleItem)
                                .toList();

                return StudentScheduleDTO.builder()
                                .studentId(student.getId())
                                .studentName(student.getFirstName() + " " + student.getLastName())
                                .semesterName(semester == null ? "N/A" : semester.getName())
                                .schedule(scheduleItems)
                                .build();
        }

        private ScheduleItemDTO toScheduleItem(Enrollment enrollment) {
                var section = enrollment.getCourseSection();
                var course = section.getCourse();
                var teacher = section.getTeacher();
                var timeSlot = section.getTimeSlot();

                return ScheduleItemDTO.builder()
                                .courseName(course.getName())
                                .courseCode(course.getCode())
                                .teacherName("%s %s".formatted(
                                                teacher.getFirstName(),
                                                teacher.getLastName()))
                                .classroomId(section.getClassroomId())
                                .dayOfWeek(timeSlot.getDayOfWeek())
                                .startTime(timeSlot.getStartTime())
                                .endTime(timeSlot.getEndTime())
                                .build();
        }

}
