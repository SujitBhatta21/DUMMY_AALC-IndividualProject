package com.example.server.service;

import com.example.server.repository.ShardRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserShardProgressRepository;
import org.springframework.stereotype.Service;

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

    public void getActiveTodayUsers() {
        System.out.println("getActiveTodayUsers fetched successfully.");
    }

    public void getTotalShardsCompleted() {
    }

    public void getTotalPuzzlesSolved() {

    }
}
