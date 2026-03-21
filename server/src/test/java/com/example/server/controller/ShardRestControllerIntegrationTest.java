package com.example.server.controller;

import com.example.server.config.SecurityConfig;
import com.example.server.model.Shard;
import com.example.server.repository.UserRepository;
import com.example.server.service.JwtService;
import com.example.server.service.ShardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(ShardController.class)
@Import(SecurityConfig.class)
public class ShardRestControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Required by SecurityConfig (JwtAuthFilter)
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private ShardService shardService;

    private Shard createShard(Integer id, String title) {
        Shard shard = new Shard(1, title, "Question?", Map.of(1, List.of("answer")), "Reward", "fitb");
        shard.setId(id);
        return shard;
    }

    
    // GET /api/shard

    @Test
    public void getShards_returns200WithShardList() throws Exception {
        List<Shard> shards = List.of(createShard(1, "Alpha"), createShard(2, "Beta"));
        when(shardService.getShards()).thenReturn(shards);

        mockMvc.perform(get("/api/shard").with(user("user")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Alpha"))
                .andExpect(jsonPath("$[1].title").value("Beta"));
    }

    @Test
    public void getShards_returns200WithEmptyList() throws Exception {
        when(shardService.getShards()).thenReturn(List.of());

        mockMvc.perform(get("/api/shard").with(user("user")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    // GET /api/shard/{id}

    @Test
    public void getShardById_returns200WhenFound() throws Exception {
        Shard shard = createShard(1, "Alpha");
        when(shardService.getShardById(1)).thenReturn(Optional.of(shard));

        mockMvc.perform(get("/api/shard/1").with(user("user")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Alpha"))
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void getShardById_returns404WhenNotFound() throws Exception {
        when(shardService.getShardById(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/shard/999").with(user("user")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void getShards_returns403WhenNotAuthenticated() throws Exception {
        // No @WithMockUser to make serurity reject this HTTP request.
        mockMvc.perform(get("/api/shard"))
                .andExpect(status().isForbidden());
    }
}