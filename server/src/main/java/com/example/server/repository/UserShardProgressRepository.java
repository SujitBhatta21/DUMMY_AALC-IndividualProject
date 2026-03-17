package com.example.server.repository;

import com.example.server.model.UserShardProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserShardProgressRepository extends JpaRepository<UserShardProgress, Integer> {
    boolean existsByUserUserIdAndShardId(Long userId, Integer shardId);
    UserShardProgress findByUserUserIdAndShardId(Long userId, Integer shardId);
    List<UserShardProgress> findByUserUserId(Long userId);
    Long countByIsCompletedTrue();

    @Query("""
      SELECT COUNT(u) FROM User u
      WHERE (SELECT COUNT(usp) FROM UserShardProgress usp
             WHERE usp.user = u AND usp.isCompleted = true) = :totalShards
      """)

    Long countUsersWhoCompletedAll(@Param("totalShards") long totalShards);

    Long countByShardIdAndIsCompletedTrue(Integer shardId);
    void deleteByUserUserId(Integer userId);
}
