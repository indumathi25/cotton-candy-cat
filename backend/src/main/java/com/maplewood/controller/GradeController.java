package com.maplewood.controller;

import com.maplewood.dto.GradeReportDTO;
import com.maplewood.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    @GetMapping("/{studentId}/grades")
    public GradeReportDTO getGradeReport(@PathVariable Long studentId) {
        return gradeService.getGradeReport(studentId);
    }
}
