package com.example.server.repository;

import com.example.server.model.Shard;
import com.example.server.model.User;
import com.example.server.model.UserShardProgress;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;


@DataJpaTest
public class UserShardProgressRepoTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShardRepository shardRepository;

    @Autowired
    private UserShardProgressRepository userShardProgressRepository;

    private User alice;
    private User bob;
    private Shard shard1;
    private Shard shard2;


    // Helper Functions
    private User createUser(String username) {
        User user = new User("Password123");
        user.setUsername(username);
        return userRepository.save(user);
    }

    private Shard createShard(Integer shardNumber, String title) {
        return shardRepository.save(
                new Shard(shardNumber, title, "Question?", Map.of(1, List.of("answer")), "Reward text", "fitb")
        );
    }

    private UserShardProgress createProgress(User user, Shard shard, boolean isCompleted) {
        UserShardProgress progress = new UserShardProgress();
        progress.setUser(user);
        progress.setShard(shard);
        progress.setUnlocked(true);
        progress.setCompleted(isCompleted);
        return userShardProgressRepository.save(progress);
    }

    @BeforeEach
    void setUp() {
        alice  = createUser("Alice");
        bob    = createUser("Bob");
        shard1 = createShard(1, "Shard One");
        shard2 = createShard(2, "Shard Two");
    }


    @Test
    public void existsByUserUserIdAndShardId_returnsTrueWhenRecordExists() {
        createProgress(alice, shard1, false);

        boolean result = userShardProgressRepository
                .existsByUserUserIdAndShardId(alice.getUserId().longValue(), shard1.getId());

        assertThat(result).isTrue();
    }

    @Test
    public void existsByUserUserIdAndShardId_returnsFalseWhenNoRecord() {
        boolean result = userShardProgressRepository
                .existsByUserUserIdAndShardId(alice.getUserId().longValue(), shard1.getId());

        assertThat(result).isFalse();
    }


    @Test
    public void findByUserUserIdAndShardId_returnsShard() {
        createProgress(alice, shard1, true);

        UserShardProgress result = userShardProgressRepository
                .findByUserUserIdAndShardId(alice.getUserId().longValue(), shard1.getId());

        assertThat(result).isNotNull();
        assertThat(result.getUser().getUsername()).isEqualTo("Alice");
        assertThat(result.getShard().getId()).isEqualTo(shard1.getId());
    }

    @Test
    public void findByUserUserIdAndShardId_returnsNullWhenNotFound() {
        UserShardProgress result = userShardProgressRepository
                .findByUserUserIdAndShardId(alice.getUserId().longValue(), shard1.getId());

        assertThat(result).isNull();
    }

    // findByUserUserId 
    
    @Test
    public void findByUserUserId_returnsAllProgressForThatUser() {
        createProgress(alice, shard1, false);
        createProgress(alice, shard2, true);
        createProgress(bob,   shard1, false);  // different user — should not appear

        List<UserShardProgress> result = userShardProgressRepository
                .findByUserUserId(alice.getUserId().longValue());

        assertThat(result).hasSize(2);
        assertThat(result).allMatch(p -> p.getUser().getUsername().equals("Alice"));
    }

    @Test
    public void findByUserUserId_returnsEmptyListWhenUserHasNoProgress() {
        List<UserShardProgress> result = userShardProgressRepository
                .findByUserUserId(alice.getUserId().longValue());

        assertThat(result).isEmpty();
    }

    // countByIsCompletedTrue
    
    @Test
    public void countByIsCompletedTrue_returnsCorrectCount() {
        createProgress(alice, shard1, true);
        createProgress(alice, shard2, false);
        createProgress(bob,   shard1, true);

        Long count = userShardProgressRepository.countByIsCompletedTrue();

        assertThat(count).isEqualTo(2);
    }

    @Test
    public void countByIsCompletedFalse_returnsZeroWhenNoneCompleted() {
        createProgress(alice, shard1, false);

        Long count = userShardProgressRepository.countByIsCompletedTrue();

        assertThat(count).isEqualTo(0);
    }

    // countUsersWhoCompletedAll 
    @Test
    public void countUsersWhoCompletedAll_returnsOneWhenUserCompletedAllShards() {
        createProgress(alice, shard1, true);
        createProgress(alice, shard2, true);
        createProgress(bob,   shard1, true);   // bob only completed 1 of 2 — not counted

        Long count = userShardProgressRepository.countUsersWhoCompletedAll(2);

        assertThat(count).isEqualTo(1);
    }

    @Test
    public void countUsersWhoCompletedAll_returnsZeroWhenNoUserFinishedAll() {
        createProgress(alice, shard1, true);
        createProgress(alice, shard2, false);

        Long count = userShardProgressRepository.countUsersWhoCompletedAll(2);

        assertThat(count).isEqualTo(0);
    }

    // countByShardIdAndIsCompletedTrue
    @Test
    public void countByShardIdAndIsCompletedTrue_returnsCorrectCountForShard() {
        createProgress(alice, shard1, true);
        createProgress(bob,   shard1, true);
        createProgress(alice, shard2, true);   // different shard — should not be counted

        Long count = userShardProgressRepository
                .countByShardIdAndIsCompletedTrue(shard1.getId());

        assertThat(count).isEqualTo(2);
    }

    @Test
    public void countByShardIdAndIsCompletedTrue_returnsZeroWhenNobodyCompleted() {
        createProgress(alice, shard1, false);

        Long count = userShardProgressRepository
                .countByShardIdAndIsCompletedTrue(shard1.getId());

        assertThat(count).isEqualTo(0);
    }

    // deleteByUserUserId 
    @Test
    public void deleteByUserUserId_removesOnlyTargetUsersRecords() {
        createProgress(alice, shard1, false);
        createProgress(alice, shard2, true);
        createProgress(bob,   shard1, false);

        userShardProgressRepository.deleteByUserUserId(alice.getUserId());

        assertThat(userShardProgressRepository.findByUserUserId(alice.getUserId().longValue())).isEmpty();
        assertThat(userShardProgressRepository.findByUserUserId(bob.getUserId().longValue())).hasSize(1);
    }

    // findTop10ByIsCompletedTrueOrderByCompletedAtDesc 
    
    @Test
    public void findTop10ByIsCompletedTrueOrderByCompletedAtDesc_excludesIncompleteRecords() {
        createProgress(alice, shard1, true);
        createProgress(alice, shard2, false);  // not completed this should be excluded

        List<UserShardProgress> result = userShardProgressRepository
                .findTop10ByIsCompletedTrueOrderByCompletedAtDesc();

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().getIsCompleted()).isTrue();
    }

    @Test
    public void findTop10ByIsCompletedTrueOrderByCompletedAtDesc_returnsAtMostTenRecords() {
        Shard shard3 = createShard(3, "Shard Three");

        // Create 11 completed records
        for (int i = 0; i < 11; i++) {
            User user = createUser("User" + i);
            createProgress(user, shard3, true);
        }

        List<UserShardProgress> result = userShardProgressRepository
                .findTop10ByIsCompletedTrueOrderByCompletedAtDesc();

        assertThat(result).hasSize(10);
    }
}
