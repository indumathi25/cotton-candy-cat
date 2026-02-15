package com.maplewood.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.service.EnrollmentService;
import com.maplewood.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
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

    @MockBean
    private EnrollmentService enrollmentService;

    @MockBean
    private StudentService studentService;

    @Test
    void testEnrollEndpoint_Unauthenticated_Returns401() throws Exception {
        EnrollmentRequestDTO request = new EnrollmentRequestDTO(1L, 1L);
        mockMvc.perform(post("/api/enroll")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Full authentication is required to access this resource"));
    }

    @Test
    @WithMockUser(username = "student", roles = { "STUDENT" })
    void testEnrollEndpoint_AuthenticatedStudent_Returns200() throws Exception {
        EnrollmentRequestDTO request = new EnrollmentRequestDTO(1L, 1L);
        EnrollmentResponseDTO response = new EnrollmentResponseDTO();
        response.setStatus("SUCCESS");

        when(enrollmentService.enrollStudent(any(EnrollmentRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/enroll")
                .with(csrf()) // Just in case, though it's disabled
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void testEnrollEndpoint_AuthenticatedAdmin_UsingAPI_Returns403() throws Exception {
        EnrollmentRequestDTO request = new EnrollmentRequestDTO(1L, 1L);
        mockMvc.perform(post("/api/enroll")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("Forbidden"))
                .andExpect(jsonPath("$.message").value("You do not have permission to access this resource"));
    }

    @Test
    @WithMockUser(username = "student", roles = { "STUDENT" })
    void testEnrollEndpoint_InvalidInput_Returns400() throws Exception {
        EnrollmentRequestDTO request = new EnrollmentRequestDTO(-1L, 1L); // Invalid Student ID
        mockMvc.perform(post("/api/enroll")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
