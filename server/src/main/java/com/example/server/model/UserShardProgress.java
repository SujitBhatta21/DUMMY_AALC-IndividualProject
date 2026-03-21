package com.example.server.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
public class UserShardProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "shard_id")
    private Shard shard;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private boolean isUnlocked;
    private boolean isCompleted;

    // Addin this for activity log in admin page.
    @CreationTimestamp
    private Instant completedAt;

    public UserShardProgress() {}

    public UserShardProgress(Integer id, Shard shard, User user) {
        this.id = id;
        this.shard = shard;
        this.user = user;
    }

    public Integer getId() {
        return id;
    }

    public Shard getShard() {
        return shard;
    }

    public void setShard(Shard shard) {
        this.shard = shard;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean getIsUnlocked() {
        return isUnlocked;
    }

    public void setUnlocked(boolean unlocked) {
        isUnlocked = unlocked;
    }

    public boolean getIsCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
        this.completedAt = Instant.now(); // Setting completed timestamp.
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}
