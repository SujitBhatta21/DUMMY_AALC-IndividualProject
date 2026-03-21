package com.example.server.service;

import com.example.server.model.Report;
import com.example.server.model.ReportStatus;
import com.example.server.model.User;
import com.example.server.repository.ReportRepository;
import com.example.server.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReportService reportService;


    // submitReport 
    @Test
    public void submitReport_throwsIfTitleIsBlank() {
        assertThatThrownBy(() -> reportService.submitReport("FOO", "", "A description."))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Title and description are required.");
    }

    @Test
    public void submitReport_throwsIfDescriptionIsBlank() {
        assertThatThrownBy(() -> reportService.submitReport("FOO", "A Title", ""))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Title and description are required.");
    }

    @Test
    public void submitReport_throwsIfUserNotFound() {
        when(userRepository.findByUsername("ghost")).thenReturn(null);

        assertThatThrownBy(() -> reportService.submitReport("ghost", "A Title", "A description."))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("User not found.");
    }

    @Test
    public void submitReport_savesReportOnSuccess() {
        User foo = new User("hashed");
        foo.setUsername("FOO");
        when(userRepository.findByUsername("FOO")).thenReturn(foo);

        reportService.submitReport("FOO", "Bug found", "Something is broken.");

        verify(reportRepository).save(any(Report.class));
    }


    // getAllReports 
    @Test
    public void getAllReports_returnsReportsOrderedByCreatedAtDesc() {
        User foo = new User("hashed");
        List<Report> reports = List.of(new Report(foo, "Bug", "Details."));
        when(reportRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))).thenReturn(reports);

        List<Report> result = reportService.getAllReports();

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().getTitle()).isEqualTo("Bug");
    }


    // updateStatus 
    @Test
    public void updateStatus_throwsIfReportNotFound() {
        when(reportRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reportService.updateStatus(99, ReportStatus.RESOLVED))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Report not found.");
    }

    @Test
    public void updateStatus_updatesStatusAndSaves() {
        User foo = new User("hashed");
        Report report = new Report(foo, "Bug", "Details.");
        when(reportRepository.findById(1)).thenReturn(Optional.of(report));
        when(reportRepository.save(report)).thenReturn(report);

        Report result = reportService.updateStatus(1, ReportStatus.RESOLVED);

        assertThat(result.getStatus()).isEqualTo(ReportStatus.RESOLVED);
        verify(reportRepository).save(report);
    }
}