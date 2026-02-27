package com.maplewood.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class EnrollmentRequestDTO {
    @NotNull(message = "Student ID is required")
    @Min(value = 1, message = "Student ID must be positive")
    @NonNull
    private Long studentId;

    @NotNull(message = "Course Section ID is required")
    @Min(value = 1, message = "Course Section ID must be positive")
    @NonNull
    private Long courseSectionId;
}
