package com.maplewood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDto {

    private Long id;
    private String name;
    private int credits;
    private int minGrade;
    private int maxGrade;
    private List<Long> prerequisiteIds;
}
