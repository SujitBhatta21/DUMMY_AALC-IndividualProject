package com.example.server.controller;

import com.example.server.config.SecurityConfig;
import com.example.server.model.Role;
import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.JwtService;
import com.example.server.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@ExtendWith(SpringExtension.class)
@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
public class UserRestControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    // Simple google showed me easy way to convert MockMcv HTTP request JSON into Java objects.
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Needed by SecurityConfig (JwtAuthFilter) which is loaded in the web slice.
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private UserService userService;

    
    // POST /api/accounts/register

    @Test
    public void register_returns200OnSuccess() throws Exception {
        User user = new User("Password1");
        user.setUsername("NewUser");

        when(userService.register(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/api/accounts/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(content().string("Registration successful."));
    }

    @Test
    public void register_returns400WhenUsernameTaken() throws Exception {
        User user = new User("Password1");
        user.setUsername("TakenUser");

        when(userService.register(any(User.class)))
                .thenThrow(new IllegalArgumentException("Username already taken."));

        mockMvc.perform(post("/api/accounts/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username already taken."));
    }

    @Test
    public void register_returns400WhenPasswordInvalid() throws Exception {
        User user = new User("weak");
        user.setUsername("SomeUser");

        when(userService.register(any(User.class)))
                .thenThrow(new IllegalArgumentException("Password must be at least 8 characters."));

        mockMvc.perform(post("/api/accounts/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Password must be at least 8 characters."));
    }

    
    // POST /api/accounts/login

    @Test
    public void login_returns200WithTokenOnSuccess() throws Exception {
        User requestUser = new User("Password1");
        requestUser.setUsername("Alice");

        User foundUser = new User("hashed");
        foundUser.setUsername("Alice");
        foundUser.setRole(Role.USER);
        foundUser.setUserId(1);

        when(userService.login("Alice", "Password1")).thenReturn(foundUser);
        when(jwtService.generateToken("Alice", Role.USER)).thenReturn("mock-jwt-token");

        mockMvc.perform(post("/api/accounts/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.username").value("Alice"));
    }

    @Test
    public void login_returns400OnInvalidCredentials() throws Exception {
        User requestUser = new User("wrongpass");
        requestUser.setUsername("Alice");

        when(userService.login("Alice", "wrongpass"))
                .thenThrow(new IllegalArgumentException("Invalid username or password."));

        mockMvc.perform(post("/api/accounts/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid username or password."));
    }

    
    // GET /api/accounts/generate_username

    @Test
    public void generateUsername_returnsUsername() throws Exception {
        when(userService.getRandomUsername()).thenReturn("BlazingPanda42");

        mockMvc.perform(get("/api/accounts/generate_username"))
                .andExpect(status().isOk())
                .andExpect(content().string("BlazingPanda42"));
    }

    
    // PATCH /api/accounts/{id}/change_password

    @Test
    public void changePassword_returns200OnSuccess() throws Exception {
        when(userService.checkCorrectOldPassword(1, "OldPass1")).thenReturn(true);
        doNothing().when(userService).changePassword(eq(1), eq("NewPass1"));

        Map<String, String> body = Map.of("currentPassword", "OldPass1", "newPassword", "NewPass1");

        mockMvc.perform(patch("/api/accounts/1/change_password")
                        .with(user("user"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password updated."));
    }

    @Test
    public void changePassword_returns400IfOldPasswordWrong() throws Exception {
        when(userService.checkCorrectOldPassword(1, "WrongOld1")).thenReturn(false);

        Map<String, String> body = Map.of("currentPassword", "WrongOld1", "newPassword", "NewPass1");

        mockMvc.perform(patch("/api/accounts/1/change_password")
                        .with(user("user"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Wrong old password. Please try again..."));
    }

    @Test
    public void changePassword_returns400IfNewPasswordInvalid() throws Exception {
        when(userService.checkCorrectOldPassword(1, "OldPass1")).thenReturn(true);
        doThrow(new IllegalArgumentException("Password must be at least 8 characters."))
                .when(userService).changePassword(eq(1), eq("weak"));

        Map<String, String> body = Map.of("currentPassword", "OldPass1", "newPassword", "weak");

        mockMvc.perform(patch("/api/accounts/1/change_password")
                        .with(user("user"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Password must be at least 8 characters."));
    }
}
