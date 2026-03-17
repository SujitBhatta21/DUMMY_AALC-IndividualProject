package com.example.server.controller;

import com.example.server.model.Shard;
import com.example.server.service.ShardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/shard")
public class ShardController {

    private final ShardService shardService;

    public ShardController(ShardService shardService) {
        this.shardService = shardService;
    }

    @GetMapping
    public List<Shard> getShards() {
        return shardService.getShards();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shard> getShardById(@PathVariable Integer id) {
        return shardService.getShardById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


}