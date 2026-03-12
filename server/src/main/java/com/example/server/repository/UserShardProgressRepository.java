package com.example.server.repository;

import com.example.server.model.UserShardProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserShardProgressRepository extends JpaRepository<UserShardProgress, Integer> {
    boolean existsByUserUserIdAndShardId(Long userId, Integer shardId);
    UserShardProgress findByUserUserIdAndShardId(Long userId, Integer shardId);
    List<UserShardProgress> findByUserUserId(Long userId);
}
