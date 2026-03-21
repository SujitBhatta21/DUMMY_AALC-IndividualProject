package com.example.server.service;

import com.example.server.model.Shard;
import com.example.server.repository.ShardRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ShardServiceTest {

    @Mock
    private ShardRepository shardRepository;

    @InjectMocks
    private ShardService shardService;

    private Shard buildShard(Integer id, String title) {
        Shard shard = new Shard(1, title, "Question?", Map.of(1, List.of("answer")), "Reward", "fitb");
        shard.setId(id);
        return shard;
    }

    // getShards

    @Test
    public void getShards_returnsAllShardsOrderedById() {
        List<Shard> expected = List.of(buildShard(1, "Alpha"), buildShard(2, "Beta"));
        when(shardRepository.findAll(Sort.by("id"))).thenReturn(expected);

        List<Shard> result = shardService.getShards();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTitle()).isEqualTo("Alpha");
        assertThat(result.get(1).getTitle()).isEqualTo("Beta");
        // Verify the sort is always passed — without it order is not guaranteed in Postgres.
        verify(shardRepository).findAll(Sort.by("id"));
    }

    @Test
    public void getShards_returnsEmptyListWhenNoShards() {
        when(shardRepository.findAll(Sort.by("id"))).thenReturn(List.of());

        List<Shard> result = shardService.getShards();

        assertThat(result).isEmpty();
    }

    // getShardById

    @Test
    public void getShardById_returnsShardWhenFound() {
        Shard shard = buildShard(1, "Alpha");
        when(shardRepository.findById(1)).thenReturn(Optional.of(shard));

        Optional<Shard> result = shardService.getShardById(1);

        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Alpha");
    }

    @Test
    public void getShardById_returnsEmptyWhenNotFound() {
        when(shardRepository.findById(999)).thenReturn(Optional.empty());

        Optional<Shard> result = shardService.getShardById(999);

        assertThat(result).isEmpty();
    }
}