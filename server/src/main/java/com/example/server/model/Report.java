package com.example.server.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;


@Entity
@Table(name = "report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password", "role", "lastActiveAt"})
    private User user;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.OPEN;

    public Report() {}

    public Report(User user, String title, String description) {
        this.user = user;
        this.title = title;
        this.description = description;
    }

    public Integer getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getCreatedAt() { return createdAt; }
    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }
}