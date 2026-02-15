package com.maplewood.service;

import com.maplewood.dto.StudentProfileDTO;
import org.springframework.lang.NonNull;

public interface StudentService {
    StudentProfileDTO getStudentProfile(@NonNull Long studentId);
}
