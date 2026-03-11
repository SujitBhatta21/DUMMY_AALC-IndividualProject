package com.example.server.service;

import com.example.server.model.Shard;
import com.example.server.repository.ShardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;

@Service
public class ShardService {
    private final ShardRepository shardRepository;

    public ShardService(ShardRepository shardRepository) {
        this.shardRepository = shardRepository;
    }

    public List<Shard> getShards() {
        // BugFix: without sort there was no guranteed order of shard in postgres.
        return shardRepository.findAll(Sort.by("id"));
    }

    public Optional<Shard> getShardById(Integer id) {
        return shardRepository.findById(id);
    }

    public Shard completeShard(Integer shardId) {
        Shard shard = shardRepository.findById(shardId)
                .orElseThrow(() -> new IllegalArgumentException("Shard not found: " + shardId));

        if (!shard.isUnlocked()) {
            throw new IllegalStateException("Shard " + shardId + " is still locked.");
        }

        shard.setCompleted(true);
        shardRepository.save(shard);

        // Unlock the next shard
        if (shardId < 9) {
            Optional<Shard> nextShard = shardRepository.findById(shardId + 1);
            nextShard.ifPresent(next -> {
                next.setUnlocked(true);
                shardRepository.save(next);
            });
        }

        return shard;
    }
}