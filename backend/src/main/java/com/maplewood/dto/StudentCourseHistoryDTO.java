package com.maplewood.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class StudentCourseHistoryDTO {
    private List<Long> completedCourseIds;
    private List<Long> activeCourseIds;
    private List<StudentEnrollmentDTO> allEnrollments;
}
