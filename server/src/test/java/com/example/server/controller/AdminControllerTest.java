package com.example.server.controller;

import com.example.server.model.Report;
import com.example.server.model.ReportStatus;
import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.JwtService;
import com.example.server.service.ReportService;
import com.example.server.service.StatsService;
import com.example.server.service.UserService;
import com.example.server.config.SecurityConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@Import(SecurityConfig.class)
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private StatsService statsService;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private ReportService reportService;


    // GET /api/accounts/admin/total_users
    @Test
    public void getTotalUsers_returns200ForAdmin() throws Exception {
        when(statsService.getTotalUsers()).thenReturn(List.of(10L, 2L, 8L));    // Major Bug avoided with 10L i.e. 10 of type Long.

        mockMvc.perform(get("/api/accounts/admin/total_users").with(user("user").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0]").value(10))
                .andExpect(jsonPath("$[1]").value(2))
                .andExpect(jsonPath("$[2]").value(8));
    }


    // Just incase I have test for non-users as well for all AdminController HTTP requests test.
    @Test
    public void getTotalUsers_returns403ErrorForNonAdmin() throws Exception {
        mockMvc.perform(get("/api/accounts/admin/total_users").with(user("user").roles("USER")))
                .andExpect(status().isForbidden());
    }


    // GET /api/accounts/admin/active_today

    @Test
    public void getActiveTodayUsers_returns200WithCount() throws Exception {
        when(statsService.getActiveTodayUsers()).thenReturn(5L);

        mockMvc.perform(get("/api/accounts/admin/active_today").with(user("user").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(content().string("5"));
    }

    @Test
    public void getActiveTodayUsers_returns403ForNonAdmin() throws Exception {
        when(statsService.getActiveTodayUsers()).thenReturn(5L);
        mockMvc.perform(get("/api/accounts/admin/active_today").with(user("user").roles("USER")))
                .andExpect(status().isForbidden());
    }

    // GET /api/accounts/admin/shards_completed

    @Test
    public void getShardsCompleted_returns200WithCount() throws Exception {
        when(statsService.getTotalShardsCompleted()).thenReturn(42L);

        mockMvc.perform(get("/api/accounts/admin/shards_completed").with(user("user").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(content().string("42"));
    }

    @Test
    public void getShardsCompleted_returns403ErrorForNonAdmin() throws Exception {
        when(statsService.getTotalShardsCompleted()).thenReturn(42L);
        mockMvc.perform(get("/api/accounts/admin/shards_completed").with(user("user").roles("USER")))
                .andExpect(status().isForbidden());
    }

    // GET /api/accounts/admin/total_all_puzzle_solved

    @Test
    public void getTotalAllPuzzleSolved_returns200WithCount() throws Exception {
        when(statsService.getTotalAllPuzzlesSolved()).thenReturn(3L);

        mockMvc.perform(get("/api/accounts/admin/total_all_puzzle_solved").with(user("user").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(content().string("3"));
    }

    @Test
    public void getTotalAllPuzzleSolved_returns403ErrorForNonAdmin() throws Exception {
        when(statsService.getTotalAllPuzzlesSolved()).thenReturn(3L);

        mockMvc.perform(get("/api/accounts/admin/total_all_puzzle_solved").with(user("user").roles("USER")))
                .andExpect(status().isForbidden());
    }

    // GET /api/accounts/admin/shard_completion_rate

    @Test
    public void getShardCompletionRate_returns200WithList() throws Exception {
        List<StatsService.ShardProgress> rates = List.of(
                new StatsService.ShardProgress(1, "Intro Shard", 75),
                new StatsService.ShardProgress(2, "Advanced Shard", 50)
        );
        when(statsService.getAdminShardCompletionRate()).thenReturn(rates);

        mockMvc.perform(get("/api/accounts/admin/shard_completion_rate").with(user("user").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Intro Shard"))
                .andExpect(jsonPath("$[0].percentage").value(75))
                .andExpect(jsonPath("$[1].title").value("Advanced Shard"))
                .andExpect(jsonPath("$[1].percentage").value(50));
    }

    @Test
    public void getShardCompletionRate_returns200WithEmptyListWhenNoUsers() throws Exception {
        when(statsService.getAdminShardCompletionRate()).thenReturn(List.of());

        mockMvc.perform(get("/api/accounts/admin/shard_completion_rate").with(user("user").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void getShardCompletionRate_returns403ErrorForNonAdmin() throws Exception {
        when(statsService.getAdminShardCompletionRate()).thenReturn(List.of());
        mockMvc.perform(get("/api/accounts/admin/shard_completion_rate").with(user("user").roles("USER")))
                .andExpect(status().isForbidden());
    }

    // GET /api/accounts/admin/activity_log

    @Test
    public void getActivityLog_returns200WithItems() throws Exception {
        List<UserService.ActivityItem> items = List.of(
                new UserService.ActivityItem("New user registered: FOO", Instant.now()),
                new UserService.ActivityItem("Shard #1 completed by BAR", Instant.now())
        );
        when(userService.getRecentActivity()).thenReturn(items);

        mockMvc.perform(get("/api/accounts/admin/activity_log").with(user("user").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].text").value("New user registered: FOO"))
                .andExpect(jsonPath("$[1].text").value("Shard #1 completed by BAR"));
    }

    @Test
    public void getActivityLog_returns403ErrorForNonAdmin() throws Exception {
        when(userService.getRecentActivity()).thenReturn(List.of());
        mockMvc.perform(get("/api/accounts/admin/activity_log").with(user("user").roles("USER")))
                .andExpect(status().isForbidden());
    }

    // GET /api/accounts/admin/users

    @Test
    public void getAllUsers_returns200WithUserList() throws Exception {
        User foo = new User("hashed");
        foo.setUsername("FOO");
        when(userService.getUser()).thenReturn(List.of(foo));

        mockMvc.perform(get("/api/accounts/admin/users").with(user("user").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].username").value("FOO"));
    }

    @Test
    public void getAllUsers_returns403ForNonAdmin() throws Exception {
        when(userService.getUser()).thenReturn(List.of());
        mockMvc.perform(get("/api/accounts/admin/users").with(user("user").roles("USER")))
                .andExpect(status().isForbidden());
    }

    // DELETE /api/accounts/admin/users/{userId}

    @Test
    public void deleteUser_returns200OnSuccess() throws Exception {
        doNothing().when(userService).deleteUserById(1);

        mockMvc.perform(delete("/api/accounts/admin/users/1").with(user("user").roles("ADMIN")).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("User deleted."));

        verify(userService).deleteUserById(1);
    }

    @Test
    public void deleteUser_returns400WhenUserNotFound() throws Exception {
        doThrow(new IllegalArgumentException("User not found."))
                .when(userService).deleteUserById(999);

        mockMvc.perform(delete("/api/accounts/admin/users/999").with(user("user").roles("ADMIN")).with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User not found."));
    }

    @Test
    public void deleteUser_returns403WhenUserIsNotAdmin() throws Exception {
        mockMvc.perform(delete("/api/accounts/admin/users/999").with(user("user").roles("USER")).with(csrf()))
                .andExpect(status().isForbidden());
    }


    // GET /api/accounts/admin/reports

    @Test
    public void getReports_returns200WithReportList() throws Exception {
        User user = new User("hashed");
        user.setUsername("FOO");
        Report report = new Report(user, "Bug", "Something broke.");
        when(reportService.getAllReports()).thenReturn(List.of(report));

        mockMvc.perform(get("/api/accounts/admin/reports").with(user("user").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Bug"));
    }

    @Test
    public void getReports_returns403WhenUserIsNotAdmin() throws Exception {
        mockMvc.perform(get("/api/accounts/admin/reports").with(user("user").roles("USER")))
                .andExpect(status().isForbidden());
    }


    // PATCH /api/accounts/admin/reports/{id}/status

    @Test
    public void updateReportStatus_returns200WithUpdatedReport() throws Exception {
        User user = new User("hashed");
        user.setUsername("FOO");
        Report report = new Report(user, "Bug", "Something broke.");
        report.setStatus(com.example.server.model.ReportStatus.RESOLVED);
        when(reportService.updateStatus(1, ReportStatus.RESOLVED)).thenReturn(report);

        mockMvc.perform(patch("/api/accounts/admin/reports/1/status")
                        .with(user("user").roles("ADMIN"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"RESOLVED\""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RESOLVED"));
    }

    @Test
    public void updateReportStatus_returns404WhenReportNotFound() throws Exception {
        when(reportService.updateStatus(eq(999), any()))
                .thenThrow(new IllegalArgumentException("Report not found."));

        mockMvc.perform(patch("/api/accounts/admin/reports/999/status")
                        .with(user("user").roles("ADMIN"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"RESOLVED\""))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateReportStatus_returns403WhenUserIsNotAdmin() throws Exception {
        mockMvc.perform(patch("/api/accounts/admin/reports/999/status")
                        .with(user("user").roles("USER"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("RESOLVED"))
                .andExpect(status().isForbidden());
    }


    // Unauthenticated access

    @Test
    public void anyAdmin_returns403WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/accounts/admin/users"))
                .andExpect(status().isForbidden()); // It's isForbidden with error code 403 not 401 .isUnexpected()
    }
}
