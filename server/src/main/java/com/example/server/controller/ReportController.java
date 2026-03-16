package com.example.server.controller;

import com.example.server.model.Report;
import com.example.server.model.User;
import com.example.server.repository.ReportRepository;
import com.example.server.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportController(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<String> submitReport(
            @AuthenticationPrincipal String username,
            @RequestBody Map<String, String> body
    ) {
        String title = body.get("title");
        String description = body.get("description");

        if (title == null || title.isBlank() || description == null || description.isBlank()) {
            return ResponseEntity.badRequest().body("Title and description are required.");
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found.");
        }

        reportRepository.save(new Report(user, title, description));
        return ResponseEntity.ok("Report submitted successfully.");
    }


    // API fetch request for Admin Reports panel. (Don't know if I want user to see their own reports.. I'll work later if I have time)
//    @GetMapping("/fetch")
//    public ResponseEntity<String> fetchReport(@AuthenticationPrincipal String username, @RequestBody Map<String, String> body){
//        String title = body.get("title");
//        String description = body.get("description");
//        return ResponseEntity.ok(userRepository.findByUsername(username));
//    }
}