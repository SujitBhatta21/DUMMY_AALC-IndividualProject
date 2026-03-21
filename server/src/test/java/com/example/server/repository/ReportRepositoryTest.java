package com.example.server.repository;

import com.example.server.model.Report;
import com.example.server.model.ReportStatus;
import com.example.server.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class ReportRepositoryTest {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    private User createUser(String username) {
        User user = new User("Password123");
        user.setUsername(username);
        return userRepository.save(user);
    }

    private Report createReport(User user, String title, String description) {
        return reportRepository.save(new Report(user, title, description));
    }

    // save / findById 

    @Test
    public void save_persistsReportAndAssignsId() {
        User user = createUser("Reporter");
        Report saved = createReport(user, "Bug Report", "Something broke.");
        assertThat(saved.getId()).isNotNull();
    }

    @Test
    public void save_defaultStatusIsOpen() {
        User user = createUser("Reporter");
        Report saved = createReport(user, "Bug Report", "Something broke.");
        assertThat(saved.getStatus()).isEqualTo(ReportStatus.OPEN);
    }

    @Test
    public void findById_returnsReportWhenExists() {
        User user = createUser("Reporter");
        Report saved = createReport(user, "Bug Report", "Something broke.");

        Optional<Report> found = reportRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Bug Report");
        assertThat(found.get().getUser().getUsername()).isEqualTo("Reporter");
    }

    @Test
    public void findById_returnsEmptyWhenNotExists() {
        Optional<Report> found = reportRepository.findById(9999);
        assertThat(found).isEmpty();
    }

    // deleteByUserUserId

    @Test
    public void deleteByUserUserId_removesAllReportsForThatUser() {
        User user = createUser("ToDelete");
        createReport(user, "Report 1", "Description 1");
        createReport(user, "Report 2", "Description 2");

        reportRepository.deleteByUserUserId(user.getUserId());

        // Both reports for this user should be gone.
        long remaining = reportRepository.findAll().stream()
                .filter(r -> r.getUser().getUserId().equals(user.getUserId()))
                .count();
        assertThat(remaining).isEqualTo(0);
    }

    @Test
    public void deleteByUserUserId_doesNotDeleteOtherUsersReports() {
        User userA = createUser("UserA");
        User userB = createUser("UserB");
        createReport(userA, "UserA Report", "Description");
        createReport(userB, "UserB Report", "Description");

        reportRepository.deleteByUserUserId(userA.getUserId());

        // UserB's report should still be there.
        long remaining = reportRepository.findAll().stream()
                .filter(r -> r.getUser().getUserId().equals(userB.getUserId()))
                .count();
        assertThat(remaining).isEqualTo(1);
    }

    // status update 

    @Test
    public void save_canUpdateStatus() {
        User user = createUser("Reporter");
        Report saved = createReport(user, "Bug", "Desc");

        saved.setStatus(ReportStatus.RESOLVED);
        reportRepository.save(saved);

        Report updated = reportRepository.findById(saved.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(ReportStatus.RESOLVED);
    }
}