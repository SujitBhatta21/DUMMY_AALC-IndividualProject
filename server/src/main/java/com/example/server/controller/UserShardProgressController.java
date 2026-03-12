package com.example.server.controller;

import com.example.server.model.Shard;
import com.example.server.model.User;
import com.example.server.model.UserShardProgress;
import com.example.server.repository.ShardRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserShardProgressRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class UserShardProgressController {

    private final UserShardProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final ShardRepository shardRepository;

    public UserShardProgressController(UserShardProgressRepository progressRepository,
                                       UserRepository userRepository,
                                       ShardRepository shardRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.shardRepository = shardRepository;
    }

    // GET /api/progress/{userId} — returns list of completed shardIds for a user
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProgress(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found.");

        return ResponseEntity.ok(progressRepository.findByUserUserId(userId));
    }

    // POST /api/progress/complete
    // Body: { "userId": 1, "shardId": 3 }
    @PostMapping("/complete")
    public ResponseEntity<?> completeShard(@RequestBody CompleteRequest request) {
        User user = userRepository.findById(request.userId).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found.");

        Shard shard = shardRepository.findById(request.shardId).orElse(null);
        if (shard == null) return ResponseEntity.badRequest().body("Shard not found.");

        // If record already exists, just return it
        if (progressRepository.existsByUserUserIdAndShardId(request.userId, request.shardId)) {
            return ResponseEntity.ok(progressRepository.findByUserUserIdAndShardId(request.userId, request.shardId));
        }

        UserShardProgress progress = new UserShardProgress();
        progress.setUser(user);
        progress.setShard(shard);
        progress.setCompleted(true);
        progress.setUnlocked(true);

        System.out.println("is Completed: Shard (1) = " + progress.getIsCompleted());
        System.out.println("is Unlocked: Shard () = " + progress.getIsUnlocked());

        return ResponseEntity.ok(progressRepository.save(progress));
    }

    // Inner class to map the request body
    static class CompleteRequest {
        public Long userId;
        public Integer shardId;
    }
}