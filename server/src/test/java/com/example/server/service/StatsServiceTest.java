package com.example.server.service;

import com.example.server.model.Role;
import com.example.server.model.Shard;
import com.example.server.repository.ShardRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserShardProgressRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class StatsServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ShardRepository shardRepository;

    @Mock
    private UserShardProgressRepository userShardProgressRepository;

    @InjectMocks
    private StatsService statsService;


    // getTotalUsers
    @Test
    public void getTotalUsers_returnsListOfTotalAdminAndNormalCounts() {
        when(userRepository.count()).thenReturn(10L);
        when(userRepository.countByRole(Role.ADMIN)).thenReturn(2L);
        when(userRepository.countByRole(Role.USER)).thenReturn(8L);

        List<Long> result = statsService.getTotalUsers();

        assertThat(result).containsExactly(10L, 2L, 8L);
    }


    // getTotalShardsCompleted
    @Test
    public void getTotalShardsCompleted_delegatesToRepository() {
        when(userShardProgressRepository.countByIsCompletedTrue()).thenReturn(42L);

        assertThat(statsService.getTotalShardsCompleted()).isEqualTo(42L);
    }


    // getTotalAllPuzzlesSolved
    @Test
    public void getTotalAllPuzzlesSolved_passesTotalShardCountToQuery() {
        when(shardRepository.count()).thenReturn(9L);
        when(userShardProgressRepository.countUsersWhoCompletedAll(9L)).thenReturn(3L);

        assertThat(statsService.getTotalAllPuzzlesSolved()).isEqualTo(3L);
    }


    // getAdminShardCompletionRate 
    @Test
    public void getAdminShardCompletionRate_returnsEmptyListWhenNoNormalUsers() {
        when(userRepository.countByRole(Role.USER)).thenReturn(0L);

        List<StatsService.ShardProgress> result = statsService.getAdminShardCompletionRate();

        assertThat(result).isEmpty();
    }

    @Test
    public void getAdminShardCompletionRate_calculatesPercentageCorrectly() {
        Shard shard = new Shard(1, "Intro", "Q?", Map.of(1, List.of("A")), "Reward", "fitb");
        shard.setId(1);

        when(userRepository.countByRole(Role.USER)).thenReturn(4L);
        when(shardRepository.findAll()).thenReturn(List.of(shard));
        when(userShardProgressRepository.countByShardIdAndIsCompletedTrue(1)).thenReturn(2L);

        List<StatsService.ShardProgress> result = statsService.getAdminShardCompletionRate();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("Intro");
        assertThat(result.get(0).percentage()).isEqualTo(50);  // 2/4 * 100
    }

    @Test
    public void getAdminShardCompletionRate_setsZeroPercentWhenNobodyCompletedShard() {
        Shard shard = new Shard(1, "Intro", "Q?", Map.of(1, List.of("A")), "Reward", "fitb");
        shard.setId(1);

        when(userRepository.countByRole(Role.USER)).thenReturn(4L);
        when(shardRepository.findAll()).thenReturn(List.of(shard));
        when(userShardProgressRepository.countByShardIdAndIsCompletedTrue(1)).thenReturn(0L);

        List<StatsService.ShardProgress> result = statsService.getAdminShardCompletionRate();

        assertThat(result.get(0).percentage()).isEqualTo(0);
    }
}
