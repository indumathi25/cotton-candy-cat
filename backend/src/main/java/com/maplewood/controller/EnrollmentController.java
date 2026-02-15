package com.maplewood.controller;

import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enroll")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<EnrollmentResponseDTO> enroll(
            @jakarta.validation.Valid @RequestBody EnrollmentRequestDTO request) {
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);
        if ("FAILED".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
