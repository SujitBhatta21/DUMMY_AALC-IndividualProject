package com.example.server.model;

import jakarta.persistence.*;

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

    public UserShardProgress() {}

    public UserShardProgress(Integer id, Shard shard, User user) {
        this.id = id;
        this.shard = shard;
        this.user = user;
    }

    public Integer getId() { return id; }
    public Shard getShard() { return shard; }
    public void setShard(Shard shard) { this.shard = shard; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public boolean getIsUnlocked() { return isUnlocked; }
    public void setUnlocked(boolean unlocked) { isUnlocked = unlocked; }
    public boolean getIsCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
}
