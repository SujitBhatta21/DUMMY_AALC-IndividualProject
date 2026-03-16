package com.example.server.controller;

import com.example.server.model.Report;
import com.example.server.model.ReportStatus;
import com.example.server.repository.ReportRepository;
import com.example.server.service.JwtService;
import com.example.server.service.StatsService;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/accounts/admin")
public class AdminController {

    private final StatsService statsService;
    private final JwtService jwtService;
    private final ReportRepository reportRepository;

    public AdminController(StatsService statsService, JwtService jwtService, ReportRepository reportRepository) {
        this.statsService = statsService;
        this.jwtService = jwtService;
        this.reportRepository = reportRepository;
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
