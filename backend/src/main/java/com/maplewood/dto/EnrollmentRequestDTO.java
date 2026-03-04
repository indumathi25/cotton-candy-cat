package com.maplewood.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.jspecify.annotations.NonNull;

public record EnrollmentRequestDTO(
        @NotNull(message = "Student ID is required") @Min(value = 1, message = "Student ID must be positive") @NonNull Long studentId,

        @NotNull(message = "Course Section ID is required") @Min(value = 1, message = "Course Section ID must be positive") @NonNull Long courseSectionId) {
}
