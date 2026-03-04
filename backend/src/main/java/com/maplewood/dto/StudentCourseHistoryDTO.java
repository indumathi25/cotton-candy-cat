package com.maplewood.dto;

import java.util.List;

public record StudentCourseHistoryDTO(
        List<Long> completedCourseIds,
        List<Long> activeCourseIds,
        List<StudentEnrollmentDTO> allEnrollments) {
}
