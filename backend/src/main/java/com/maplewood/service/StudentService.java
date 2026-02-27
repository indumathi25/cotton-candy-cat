package com.maplewood.service;

import com.maplewood.dto.StudentCourseHistoryDTO;
import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.dto.StudentScheduleDTO;
import org.jspecify.annotations.NonNull;

public interface StudentService {
    StudentProfileDTO getStudentProfile(@NonNull Long studentId);

    StudentScheduleDTO getStudentSchedule(@NonNull Long studentId);

    StudentCourseHistoryDTO getStudentCourseHistory(@NonNull Long studentId);
}
