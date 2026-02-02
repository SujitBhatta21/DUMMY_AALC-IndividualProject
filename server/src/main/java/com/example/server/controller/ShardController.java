package com.example.server.controller;

import com.example.server.model.PuzzleContent;
import com.example.server.model.Shard;
import com.example.server.service.PuzzleContentService;
import com.example.server.service.ShardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/shard")
public class ShardController {
    private final ShardService shardService;
    private final PuzzleContentService puzzleContentService;

    public ShardController(ShardService shardService, PuzzleContentService puzzleContentService) {
        this.shardService = shardService;
        this.puzzleContentService = puzzleContentService;
    }

    @GetMapping
    public List<Shard> getShards() {
        return List.of(
                new Shard(
                        1,
                        "Shard-1",
                        List.of("1st context", "2nd context"),
                        "Rewards Text",
                        "FILL_IN_BLANK",
                        true
                ),
                new Shard(
                        2,
                        "Shard-2",
                        List.of("1st context", "2nd context"),
                        "Rewards Text",
                        "MULTIPLE_CHOICE",
                        false
                ),
                new Shard(
                        3,
                        "Shard-3",
                        List.of("1st context", "2nd context"),
                        "Rewards Text",
                        "MATCHING",
                        false
                ),
                new Shard(
                        4,
                        "Shard-4",
                        List.of("1st context", "2nd context"),
                        "Rewards Text",
                        "FILL_IN_BLANK",
                        false
                ),
                new Shard(
                        5,
                        "Shard-5",
                        List.of("1st context", "2nd context"),
                        "Rewards Text",
                        "MULTIPLE_CHOICE",
                        false
                ),
                new Shard(
                        6,
                        "Shard-6",
                        List.of("1st context", "2nd context"),
                        "Rewards Text",
                        "MATCHING",
                        false
                ),
                new Shard(
                        7,
                        "Shard-7",
                        List.of("1st context", "2nd context"),
                        "Rewards Text",
                        "FILL_IN_BLANK",
                        false
                ),
                new Shard(
                        8,
                        "Shard-8",
                        List.of("1st context", "2nd context"),
                        "Rewards Text",
                        "MULTIPLE_CHOICE",
                        false
                ),
                new Shard(
                        9,
                        "Shard-9",
                        List.of("1st context", "2nd context"),
                        "Rewards Text",
                        "MATCHING",
                        false
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shard> getShardById(@PathVariable Integer id) {
        return shardService.getShardById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/puzzles")
    public ResponseEntity<List<PuzzleContent>> getPuzzlesForShard(@PathVariable Integer id) {
        return shardService.getShardById(id)
                .map(shard -> ResponseEntity.ok(puzzleContentService.getPuzzlesByShard(id)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Shard> completeShard(@PathVariable Integer id) {
        Shard completed = shardService.completeShard(id);
        return ResponseEntity.ok(completed);
    }
}
