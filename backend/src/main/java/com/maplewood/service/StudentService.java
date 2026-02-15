package com.maplewood.service;

import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.dto.StudentScheduleDTO;
import org.springframework.lang.NonNull;

public interface StudentService {
    StudentProfileDTO getStudentProfile(@NonNull Long studentId);

    StudentScheduleDTO getStudentSchedule(@NonNull Long studentId);
}
