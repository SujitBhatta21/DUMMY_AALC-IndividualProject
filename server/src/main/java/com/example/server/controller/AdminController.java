package com.example.server.controller;

import com.example.server.service.JwtService;
import com.example.server.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/accounts/admin")
public class AdminController {

    private final StatsService statsService;
    private final JwtService jwtService;

    public AdminController(StatsService statsService, JwtService jwtService) {
        this.statsService = statsService;
        this.jwtService = jwtService;
    }

    @GetMapping("/total_users")
    public ResponseEntity<Long> getTotalUsers() {
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
}
