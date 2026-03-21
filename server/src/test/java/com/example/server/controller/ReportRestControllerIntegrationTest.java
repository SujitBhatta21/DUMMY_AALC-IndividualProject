package com.example.server.controller;

import com.example.server.config.SecurityConfig;
import com.example.server.model.User;
import com.example.server.repository.ReportRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

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

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private ReportRepository reportRepository;

    

    @Test
    public void submitReport_returns200OnSuccess() throws Exception {
        User user = new User("hashed");
        user.setUsername("Alice");
        when(userRepository.findByUsername("Alice")).thenReturn(user);
        when(reportRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Map<String, String> body = Map.of("title", "Bug found", "description", "Something is broken.");

        mockMvc.perform(post("/api/reports")
                        .with(authentication(new UsernamePasswordAuthenticationToken("Alice", null, List.of(new SimpleGrantedAuthority("ROLE_USER")))))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(content().string("Report submitted successfully."));

        verify(reportRepository).save(any());
    }
    

    @Test
    public void submitReport_returns401WhenUserNotFoundInDatabase() throws Exception {
        when(userRepository.findByUsername("Alice")).thenReturn(null);

        Map<String, String> body = Map.of("title", "A Title", "description", "A description.");

        mockMvc.perform(post("/api/reports")
                        .with(authentication(new UsernamePasswordAuthenticationToken("Alice", null, List.of(new SimpleGrantedAuthority("ROLE_USER")))))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("User not found."));
    }

    @Test
    public void submitReport_returns401WhenNotAuthenticated() throws Exception {
        Map<String, String> body = Map.of("title", "A Title", "description", "A description.");

        mockMvc.perform(post("/api/reports")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isForbidden());
    }
}