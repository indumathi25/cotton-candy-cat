package com.maplewood.dto;

import java.util.List;

public record StudentScheduleDTO(
        Long studentId,
        String studentName,
        String semesterName,
        List<ScheduleItemDTO> schedule) {
}
