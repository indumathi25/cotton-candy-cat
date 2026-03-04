package com.maplewood.security;

import tools.jackson.databind.ObjectMapper;
import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.service.EnrollmentService;
import com.maplewood.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EnrollmentService enrollmentService;

    @MockitoBean
    private StudentService studentService;

    @Test
    void testEnrollEndpoint_Unauthenticated_Returns401() throws Exception {
        EnrollmentRequestDTO request = new EnrollmentRequestDTO(1L, 1L);
        mockMvc.perform(post("/api/enrollments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Full authentication is required to access this resource"));
    }

    @Test
    void testEnrollEndpoint_AuthenticatedStudent_Returns200() throws Exception {
        EnrollmentRequestDTO request = new EnrollmentRequestDTO(1L, 1L);
        EnrollmentResponseDTO response = new EnrollmentResponseDTO(
                null,
                "Student Name",
                "Course Name",
                "Semester Name",
                "SUCCESS",
                "Successfully enrolled");

        when(enrollmentService.enrollStudent(any(EnrollmentRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/enrollments")
                .with(user("student").roles("STUDENT"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void testEnrollEndpoint_AuthenticatedAdmin_UsingAPI_Returns403() throws Exception {
        EnrollmentRequestDTO request = new EnrollmentRequestDTO(1L, 1L);
        mockMvc.perform(post("/api/enrollments")
                .with(user("admin").roles("ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("Forbidden"))
                .andExpect(jsonPath("$.message").value("You do not have permission to access this resource"));
    }

    @Test
    void testEnrollEndpoint_InvalidInput_Returns400() throws Exception {
        EnrollmentRequestDTO request = new EnrollmentRequestDTO(-1L, 1L); // Invalid Student ID
        mockMvc.perform(post("/api/enrollments")
                .with(user("student").roles("STUDENT"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
