package com.example.server.service;

import com.example.server.model.Role;
import com.example.server.repository.ShardRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserShardProgressRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class StatsService {
    private UserRepository userRepository;
    private ShardRepository shardRepository;
    private UserShardProgressRepository userShardProgressRepository;

    public StatsService(
            UserRepository userRepository,
            ShardRepository shardRepository,
            UserShardProgressRepository userShardProgressRepository
    ) {
        this.userRepository = userRepository;
        this.shardRepository = shardRepository;
        this.userShardProgressRepository = userShardProgressRepository;
    }


    /*
     * STATS FOR ADMIN METHODS...
     */
    public Long getTotalUsers() {
        return userRepository.count();
    }

    public Long getTotalAdminUsers() {
        return userRepository.countByRole(Role.ADMIN);
    }

    public Long getTotalNormalUsers() {
        return userRepository.countByRole(Role.USER);
    }

    public Long getActiveTodayUsers() {
        Instant cutoff = Instant.now().minus(24, ChronoUnit.HOURS);
        return userRepository.countByLastActiveAtGreaterThan(cutoff);
    }

    public Long getTotalShardsCompleted() {
        return userShardProgressRepository.countByIsCompletedTrue();
    }

    public Long getTotalAllPuzzlesSolved() {
        long totalShards = shardRepository.count();
        return userShardProgressRepository.countUsersWhoCompletedAll(totalShards);
    }
}
