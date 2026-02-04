package com.example.server.controller;

import com.example.server.model.Shard;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/shard")
public class ShardController {

    private final List<Shard> shards = new ArrayList<>(List.of(
            new Shard(1, "Shard-1", "Rewards Text", "MULTIPLE_CHOICE", true),
            new Shard(2, "Shard-2", "Rewards Text", "MULTIPLE_CHOICE", false),
            new Shard(3, "Shard-3", "Rewards Text", "MATCHING", false),
            new Shard(4, "Shard-4", "Rewards Text", "FILL_IN_BLANK", false),
            new Shard(5, "Shard-5", "Rewards Text", "MULTIPLE_CHOICE", false),
            new Shard(6, "Shard-6", "Rewards Text", "MATCHING", false),
            new Shard(7, "Shard-7", "Rewards Text", "FILL_IN_BLANK", false),
            new Shard(8, "Shard-8", "Rewards Text", "MULTIPLE_CHOICE", false),
            new Shard(9, "Shard-9", "Rewards Text", "MATCHING", false)
    ));

    @GetMapping
    public List<Shard> getShards() {
        return shards;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shard> getShardById(@PathVariable Integer id) {
        return shards.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Shard> completeShard(@PathVariable Integer id) {
        Shard shard = shards.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (shard == null) {
            return ResponseEntity.notFound().build();
        }

        if (!shard.isUnlocked()) {
            return ResponseEntity.badRequest().build();
        }

        shard.setCompleted(true);

        // Unlock the next shard
        if (id < 9) {
            shards.stream()
                    .filter(s -> s.getId().equals(id + 1))
                    .findFirst()
                    .ifPresent(next -> next.setUnlocked(true));
        }

        return ResponseEntity.ok(shard);
    }
}