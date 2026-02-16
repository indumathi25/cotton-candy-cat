package com.maplewood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDto {

    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer credits;
    private Integer gradeLevelMin;
    private Integer gradeLevelMax;
    private Integer hoursPerWeek;
    private Integer semesterOrder;
    private Long prerequisiteId;
}
