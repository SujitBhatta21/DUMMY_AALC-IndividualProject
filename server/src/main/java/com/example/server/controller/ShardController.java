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
            new Shard(1, "Shard-1: The Passbook Fragment",
                    "The word “apartheid\" means ___. The National Party, a white minority political party, took power in ___ after an election in which only ___ people could vote. These laws controlled where black South Africans could live, work, and move. The ___ was one of the organisations that resisted apartheid.",
                    Map.of(1, List.of("separateness", "supremacy", "division"),
                            2, List.of("1948", "1938", "1952"),
                            3, List.of("white", "wealthy", "male"),
                            4, List.of("ANC (African National Congress)", "NAP (National African Party)", "APC (African People's Congress)", "SAC (South African Council)")),
                    "In 1952, Black South Africans were required to carry passbooks" +
                    " controlling where they could live, work, or travel. These laws turned daily life into a constant threat."
                    , "JIGSAW", true),
            new Shard(2, "Shard-2: The Silencing",
                    " The ___ Act meant anyone who spoke out could be sentenced to prison on ___." +
                            " ___ by black workers were illegal.",
                    Map.of(1, List.of("Terrorism", "Elections"),
                            2, List.of("Robben Island", "Johannesburg", "Protests"),
                            3, List.of("Strikes", "Freedom", "Treason")),
                    "The government aimed to silence resistance with Imprisonment and bannings " +
                            "– but South Africans continued to organise underground and to smuggle people " +
                            "out to continue the struggle from outside the country. Resistance found a way.",
                    "REDACTED_REVEAL", false),
            new Shard(3, "Shard-3: The Uprising ",
                    "In ___, police opened fire on peaceful protesters in ___, killing at least ___ people including children." +
                            " In 1976, students in ___ rose up against forced ___-language instruction.",
                    Map.of(1, List.of("1960", "1948", "Joannesburg", "45", "Cape Town", "English"),
                            2, List.of("Sharpeville"),
                            3, List.of("69"),
                            4, List.of("Soweto"),
                            5, List.of("Afrikaans")),
                    "From Sharpeville to Soweto, uprisings revealed the courage of ordinary people — and the cruelty of the state.\n" +
                            "These events lit a spark that spread around the world.”\n",
                    "ORDER_EVENTS_CHRONOLOGICALLY", true),
            new Shard(4, "Shard-4: The Activist's Choice",
                    "Q4 ___ (testing)",
                    Map.of(1, List.of("this, that")), "Rewards Text", "DecisionTree", true),
            new Shard(5, "Shard-5: Penton Street Office Map", "Q5", Map.of(1, List.of("")), "Rewards Text", "MULTIPLE_CHOICE", false),
            new Shard(6, "Shard-6: Bombing Puzzle", "Q6", Map.of(1, List.of("")), "Rewards Text", "MATCHING", false),
            new Shard(7, "Shard-7: The Sanctions Decision Boards", "Q7", Map.of(1, List.of("")), "Rewards Text", "FILL_IN_BLANK", false),
            new Shard(8, "Shard-8: Music", "Q8", Map.of(1, List.of("")), "Rewards Text", "MULTIPLE_CHOICE", false),
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