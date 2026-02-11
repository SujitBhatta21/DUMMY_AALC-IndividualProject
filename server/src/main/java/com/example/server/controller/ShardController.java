package com.example.server.controller;

import com.example.server.model.Shard;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/shard")
public class ShardController {

    private final List<Shard> shards = new ArrayList<>(List.of(
            new Shard(1, "Shard-1",
                    "The word “apartheid\" means ___. The National Party, a white minority political party, took power in ___ after an election in which only ___ people could vote. These laws controlled where black South Africans could live, work, and move. The ___ was one of the organisations that resisted apartheid.",
                    Map.of(1, List.of("separateness", "inequality", "supremacy", "division"),
                            2, List.of("1948", "1938", "1952"),
                            3, List.of("white", "wealthy", "male"),
                            4, List.of("ANC (African National Congress)", "NAP (National African Party)", "APC (African People's Congress)", "SAC (South African Council)")),
                    "In 1952, Black South Africans were required to carry passbooks" +
                    " controlling where they could live, work, or travel. These laws turned daily life into a constant threat."
                    , "JIGSAW", true),
            new Shard(2, "Shard-2", "", Map.of(1, List.of("")), "Rewards Text", "MULTIPLE_CHOICE", false),
            new Shard(3, "Shard-3", "Q3", Map.of(1, List.of("")), "Rewards Text", "MATCHING", false),
            new Shard(4, "Shard-4", "Q4", Map.of(1, List.of("")), "Rewards Text", "FILL_IN_BLANK", false),
            new Shard(5, "Shard-5", "Q5", Map.of(1, List.of("")), "Rewards Text", "MULTIPLE_CHOICE", false),
            new Shard(6, "Shard-6", "Q6", Map.of(1, List.of("")), "Rewards Text", "MATCHING", false),
            new Shard(7, "Shard-7", "Q7", Map.of(1, List.of("")), "Rewards Text", "FILL_IN_BLANK", false),
            new Shard(8, "Shard-8", "Q8", Map.of(1, List.of("")), "Rewards Text", "MULTIPLE_CHOICE", false),
            new Shard(9, "Shard-9", "Q9", Map.of(1, List.of("")), "Rewards Text", "MATCHING", false)
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