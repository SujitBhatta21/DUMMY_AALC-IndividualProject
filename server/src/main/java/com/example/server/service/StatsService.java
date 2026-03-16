package com.example.server.service;

import ch.qos.logback.core.joran.sanity.Pair;
import com.example.server.model.Role;
import com.example.server.model.Shard;
import com.example.server.repository.ShardRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserShardProgressRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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



    public record ShardProgress(String title, Integer percentage) {}

    public List<ShardProgress> getAdminShardCompletionRate() {
        long totalUsers = userRepository.count();

        // Edge case to avoid division with 0 if there is no user. (still i'll have an admin in DataSeeder.)
        if (totalUsers == 0) {
            return new ArrayList<>();
        }

        List<Shard> allShards = shardRepository.findAll();
        List<ShardProgress> pairs = new ArrayList<>();

        for (Shard shard : allShards) {
            int percentCompletion = 0;
            long completedCount = userShardProgressRepository.countByShardIdAndIsCompletedTrue(shard.getId());
            if (completedCount > 0) {
                percentCompletion = (int)(completedCount * 100.0 / totalUsers);
            }
            pairs.add(new ShardProgress(shard.getTitle(), percentCompletion));
        }
        return pairs;
    }
}
