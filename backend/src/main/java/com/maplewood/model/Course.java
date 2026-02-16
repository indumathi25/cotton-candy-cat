package com.maplewood.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses", indexes = {
        @Index(name = "idx_course_code", columnList = "code"),
        @Index(name = "idx_course_name", columnList = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "specialization_id")
    private Integer specializationId;

    @Column(name = "prerequisite_id")
    private Long prerequisiteId;

    @Column(nullable = false)
    private Integer credits;

    @Column(name = "hours_per_week", nullable = false)
    private Integer hoursPerWeek;

    @Column(name = "semester_order", nullable = false)
    private Integer semesterOrder;

    @Column(name = "grade_level_min", nullable = false)
    private Integer gradeLevelMin;

    @Column(name = "grade_level_max", nullable = false)
    private Integer gradeLevelMax;

    @Column(name = "course_type", nullable = false)
    private String courseType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
