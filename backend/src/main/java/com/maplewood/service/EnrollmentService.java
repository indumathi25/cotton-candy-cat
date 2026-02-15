package com.maplewood.service;

import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;

public interface EnrollmentService {
    EnrollmentResponseDTO enrollStudent(EnrollmentRequestDTO request);
}
