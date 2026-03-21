package com.example.server.controller;

import com.example.server.config.SecurityConfig;
import com.example.server.repository.UserRepository;
import com.example.server.service.JwtService;
import com.example.server.service.ReportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReportController.class)
@Import(SecurityConfig.class)
public class ReportRestControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Required by SecurityConfig (JwtAuthFilter)
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private ReportService reportService;

    private static final UsernamePasswordAuthenticationToken FOO_AUTH =
            new UsernamePasswordAuthenticationToken("FOO", null,
                    List.of(new SimpleGrantedAuthority("ROLE_USER")));

    
    // POST /api/reports 

    @Test
    public void submitReport_returns200OnSuccess() throws Exception {
        doNothing().when(reportService).submitReport("FOO", "Bug found", "Something is broken.");

        Map<String, String> body = Map.of("title", "Bug found", "description", "Something is broken.");

        mockMvc.perform(post("/api/reports")
                        .with(authentication(FOO_AUTH))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(content().string("Report submitted successfully."));

        verify(reportService).submitReport("FOO", "Bug found", "Something is broken.");
    }

    @Test
    public void submitReport_returns400WhenTitleOrDescriptionBlank() throws Exception {
        doThrow(new IllegalArgumentException("Title and description are required."))
                .when(reportService).submitReport("FOO", "", "Some description.");

        Map<String, String> body = Map.of("title", "", "description", "Some description.");

        mockMvc.perform(post("/api/reports")
                        .with(authentication(FOO_AUTH))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Title and description are required."));
    }

    @Test
    public void submitReport_returns401WhenUserNotFoundInDatabase() throws Exception {
        doThrow(new IllegalStateException("User not found."))
                .when(reportService).submitReport("FOO", "A Title", "A description.");

        Map<String, String> body = Map.of("title", "A Title", "description", "A description.");

        mockMvc.perform(post("/api/reports")
                        .with(authentication(FOO_AUTH))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("User not found."));
    }

    @Test
    public void submitReport_returns403WhenNotAuthenticated() throws Exception {
        Map<String, String> body = Map.of("title", "A Title", "description", "A description.");

        mockMvc.perform(post("/api/reports")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isForbidden());
    }
}