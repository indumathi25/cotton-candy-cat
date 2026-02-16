package com.maplewood.controller;

import com.maplewood.dto.GradeReportDTO;
import com.maplewood.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    @GetMapping("/{studentId}/grades")
    public ResponseEntity<GradeReportDTO> getGradeReport(@PathVariable Long studentId) {
        GradeReportDTO gradeReport = gradeService.getGradeReport(studentId);
        return ResponseEntity.ok(gradeReport);
    }
}
