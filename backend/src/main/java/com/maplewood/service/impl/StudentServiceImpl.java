package com.maplewood.service.impl;

import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.mapper.StudentMapper;
import com.maplewood.model.CourseHistory;
import com.maplewood.model.Student;
import com.maplewood.repository.CourseHistoryRepository;
import com.maplewood.repository.StudentRepository;
import com.maplewood.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final CourseHistoryRepository courseHistoryRepository;
    private final StudentMapper studentMapper;

    private static final int CREDITS_TO_GRADUATE = 22;

    @Override
    public StudentProfileDTO getStudentProfile(@NonNull Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<CourseHistory> passedCourses = courseHistoryRepository.findByStudentAndStatus(student, "passed");

        return studentMapper.toProfileDTO(student, passedCourses, CREDITS_TO_GRADUATE);
    }
}
