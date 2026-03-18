package com.example.server.controller;

import com.example.server.model.Report;
import com.example.server.model.ReportStatus;
import com.example.server.repository.ReportRepository;
import com.example.server.service.JwtService;
import com.example.server.service.StatsService;
import com.example.server.service.UserService;
import com.example.server.service.UserService.ActivityItem;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/accounts/admin")
public class AdminController {

    private final StatsService statsService;
    private final UserService userService;
    private final JwtService jwtService;
    private final ReportRepository reportRepository;

    public AdminController(
            StatsService statsService,
            UserService userService,
            JwtService jwtService,
            ReportRepository reportRepository
    ) {
        this.statsService = statsService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.reportRepository = reportRepository;
    }

    // Dashboard Panel API fetches.
    @GetMapping("/total_users")
    public ResponseEntity<List<Long>> getTotalUsers() {
        return ResponseEntity.ok(statsService.getTotalUsers());
    }

    @GetMapping("/active_today")
    public ResponseEntity<Long> getActiveTodayUsers() {
        return ResponseEntity.ok(statsService.getActiveTodayUsers());
    }

    @GetMapping("/shards_completed")
    public ResponseEntity<Long> getShardsCompleted() {
        return ResponseEntity.ok(statsService.getTotalShardsCompleted());
    }

    @GetMapping("/total_all_puzzle_solved")
    public ResponseEntity<Long> getTotalAllPuzzleSolved() {
        return ResponseEntity.ok(statsService.getTotalAllPuzzlesSolved());
    }

    @GetMapping("shard_completion_rate")
    public ResponseEntity<List<StatsService.ShardProgress>> getShardCompletionRate() {
        return ResponseEntity.ok(statsService.getAdminShardCompletionRate());
    }

    @GetMapping("activity_log")
    public ResponseEntity<List<ActivityItem>> getActivityLog() {
        return ResponseEntity.ok(userService.getRecentActivity());
    }


    // USERPANEL API Fetches...
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getUser());
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        try {
            userService.deleteUserById(userId);
            return ResponseEntity.ok("User deleted.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // REPORTS PANEL API Fetches.
    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getReports() {
        List<Report> reports = reportRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(reports);
    }

    // Updating the report status using PatchMapping...
    @PatchMapping("/reports/{id}/status")
    public ResponseEntity<Report> updateReportStatus(@PathVariable Integer id, @RequestBody ReportStatus reportStatus) {
        Report report = reportRepository.findById(id).orElse(null);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        report.setStatus(reportStatus);
        reportRepository.save(report);
        return ResponseEntity.ok(report);
    }
}
