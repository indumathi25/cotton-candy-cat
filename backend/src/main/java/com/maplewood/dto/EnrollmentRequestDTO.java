package com.maplewood.dto;

import org.springframework.lang.NonNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class EnrollmentRequestDTO {
    @NonNull
    private Long studentId;
    @NonNull
    private Long courseSectionId;
}
