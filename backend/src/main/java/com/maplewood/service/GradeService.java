package com.maplewood.service;

import com.maplewood.dto.GradeReportDTO;

public interface GradeService {
    GradeReportDTO getGradeReport(Long studentId);
}
