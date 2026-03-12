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
}
