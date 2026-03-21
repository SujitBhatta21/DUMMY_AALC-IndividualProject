package com.example.server.service;

import com.example.server.model.Report;
import com.example.server.model.ReportStatus;
import com.example.server.model.User;
import com.example.server.repository.ReportRepository;
import com.example.server.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    public void submitReport(String username, String title, String description) {
        if (title == null || title.isBlank() || description == null || description.isBlank()) {
            throw new IllegalArgumentException("Title and description are required.");
        }
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalStateException("User not found.");
        }
        reportRepository.save(new Report(user, title, description));
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Report updateStatus(Integer id, ReportStatus status) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found."));
        report.setStatus(status);
        return reportRepository.save(report);
    }

    public void deleteByUserUserId(Integer userId) {
        reportRepository.deleteByUserUserId(userId);
    }
}