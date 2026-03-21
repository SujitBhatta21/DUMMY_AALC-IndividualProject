package com.example.server.controller;

import com.example.server.config.SecurityConfig;
import com.example.server.model.Shard;
import com.example.server.model.User;
import com.example.server.model.UserShardProgress;
import com.example.server.repository.ShardRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserShardProgressRepository;
import com.example.server.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(UserShardProgressController.class)
@Import(SecurityConfig.class)
public class UserShardProgressRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private ShardRepository shardRepository;

    @MockitoBean
    private UserShardProgressRepository userShardProgressRepository;


    // GET /api/progress/{userId} 
    @Test
    public void getUserProgress_returns200WithListWhenUserFound() throws Exception {
        User alice = new User("hashed");
        alice.setUsername("Alice");
        when(userRepository.findById(1L)).thenReturn(Optional.of(alice));
        when(userShardProgressRepository.findByUserUserId(1L)).thenReturn(List.of());

        mockMvc.perform(get("/api/progress/1").with(user("user")))
                .andExpect(status().isOk());
    }

    @Test
    public void getUserProgress_returns400WhenUserNotFound() throws Exception {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/progress/99").with(user("user")))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User not found."));
    }


    // POST /api/progress/complete
    @Test
    public void completeShard_returns400WhenUserNotFound() throws Exception {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        Map<String, Object> body = Map.of("userId", 99, "shardId", 1);

        mockMvc.perform(post("/api/progress/complete")
                        .with(user("user"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User not found."));
    }

    @Test
    public void completeShard_returns400WhenShardNotFound() throws Exception {
        User alice = new User("hashed");
        when(userRepository.findById(1L)).thenReturn(Optional.of(alice));
        when(shardRepository.findById(99)).thenReturn(Optional.empty());

        Map<String, Object> body = Map.of("userId", 1, "shardId", 99);

        mockMvc.perform(post("/api/progress/complete")
                        .with(user("user"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Shard not found."));
    }

    @Test
    public void completeShard_returnsExistingProgressWhenAlreadyCompleted() throws Exception {
        User alice = new User("hashed");
        alice.setUsername("Alice");
        Shard shard = new Shard();
        shard.setId(1);

        UserShardProgress existing = new UserShardProgress();
        existing.setUser(alice);
        existing.setShard(shard);
        existing.setCompleted(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(alice));
        when(shardRepository.findById(1)).thenReturn(Optional.of(shard));
        when(userShardProgressRepository.existsByUserUserIdAndShardId(1L, 1)).thenReturn(true);
        when(userShardProgressRepository.findByUserUserIdAndShardId(1L, 1)).thenReturn(existing);

        Map<String, Object> body = Map.of("userId", 1, "shardId", 1);

        mockMvc.perform(post("/api/progress/complete")
                        .with(user("user"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());
    }

    @Test
    public void completeShard_returns200AndSavesNewProgressOnFirstCompletion() throws Exception {
        User alice = new User("hashed");
        alice.setUsername("Alice");
        Shard shard = new Shard();
        shard.setId(1);

        UserShardProgress saved = new UserShardProgress();
        saved.setUser(alice);
        saved.setShard(shard);
        saved.setCompleted(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(alice));
        when(shardRepository.findById(1)).thenReturn(Optional.of(shard));
        when(userShardProgressRepository.existsByUserUserIdAndShardId(1L, 1)).thenReturn(false);
        when(userShardProgressRepository.save(any())).thenReturn(saved);

        Map<String, Object> body = Map.of("userId", 1, "shardId", 1);

        mockMvc.perform(post("/api/progress/complete")
                        .with(user("user"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());
    }
}