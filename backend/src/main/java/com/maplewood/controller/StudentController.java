package com.maplewood.controller;

import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/{id}")
    public StudentProfileDTO getStudentProfile(@PathVariable @NonNull Long id) {
        return studentService.getStudentProfile(id);
    }
}
