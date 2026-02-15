package com.maplewood.mapper;

import com.maplewood.dto.ScheduleItemDTO;
import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.dto.StudentScheduleDTO;
import com.maplewood.model.CourseHistory;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Semester;
import com.maplewood.model.Student;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

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

        public StudentScheduleDTO toScheduleDTO(@NonNull Student student, List<Enrollment> enrollments,
                        Semester semester) {
                List<ScheduleItemDTO> scheduleItems = enrollments.stream()
                                .map(e -> ScheduleItemDTO.builder()
                                                .courseName(e.getCourseSection().getCourse().getName())
                                                .courseCode(e.getCourseSection().getCourse().getCode())
                                                .teacherName(e.getCourseSection().getTeacher().getFirstName() + " "
                                                                + e.getCourseSection().getTeacher().getLastName())
                                                .classroomId(e.getCourseSection().getClassroomId())
                                                .dayOfWeek(e.getCourseSection().getTimeSlot().getDayOfWeek())
                                                .startTime(e.getCourseSection().getTimeSlot().getStartTime())
                                                .endTime(e.getCourseSection().getTimeSlot().getEndTime())
                                                .build())
                                .collect(Collectors.toList());

                return StudentScheduleDTO.builder()
                                .studentId(student.getId())
                                .studentName(student.getFirstName() + " " + student.getLastName())
                                .semesterName(semester != null ? semester.getName() : "N/A")
                                .schedule(scheduleItems)
                                .build();
        }
}
