package com.example.server.repository;

import com.example.server.model.Shard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class ShardRepositoryTest {

    @Autowired
    private ShardRepository shardRepository;

    // Helper — shardNumber 1-9 are valid (maps to trackNumber 1/2/3).
    private Shard createShard(Integer shardNumber, String title) {
        return shardRepository.save(
                new Shard(shardNumber, title, "Question?", Map.of(1, List.of("answer")), "Reward text", "fitb")
        );
    }

    // save / findById

    @Test
    public void save_persistsShardAndAssignsId() {
        Shard saved = createShard(1, "Intro Shard");
        assertThat(saved.getId()).isNotNull();
    }

    @Test
    public void findById_returnsShardWhenExists() {
        Shard saved = createShard(1, "Intro Shard");
        Optional<Shard> found = shardRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Intro Shard");
    }

    @Test
    public void findById_returnsEmptyWhenNotExists() {
        Optional<Shard> found = shardRepository.findById(9999);
        assertThat(found).isEmpty();
    }

    
    // findAll with sort

    @Test
    public void findAll_returnsShardsOrderedById() {
        createShard(3, "Third");
        createShard(1, "First");
        createShard(2, "Second");

        List<Shard> shards = shardRepository.findAll(Sort.by("id"));

        // IDs should be in ascending order after sorting.
        for (int i = 0; i < shards.size() - 1; i++) {
            assertThat(shards.get(i).getId()).isLessThan(shards.get(i + 1).getId());
        }
    }

    
    // delete

    @Test
    public void deleteById_removesShardFromDatabase() {
        Shard saved = createShard(1, "To Be Deleted");
        shardRepository.deleteById(saved.getId());
        assertThat(shardRepository.findById(saved.getId())).isEmpty();
    }

    
    // fitb_answer converter

    @Test
    public void fitb_answer_persistsAndLoadsCorrectly() {
        Map<Integer, List<String>> answers = Map.of(1, List.of("alpha", "beta"), 2, List.of("gamma"));
        Shard shard = new Shard(1, "Converter Test", "Fill in the blank", answers, "Reward", "fitb");
        Shard saved = shardRepository.save(shard);

        // Force a DB round-trip by flushing and clearing the persistence context.
        shardRepository.flush();
        Optional<Shard> loaded = shardRepository.findById(saved.getId());

        assertThat(loaded).isPresent();
        assertThat(loaded.get().getFitb_answer()).containsKey(1);
        assertThat(loaded.get().getFitb_answer().get(1)).containsExactlyInAnyOrder("alpha", "beta");
    }
}