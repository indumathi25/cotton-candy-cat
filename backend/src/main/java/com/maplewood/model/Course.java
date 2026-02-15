package com.maplewood.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
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

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
