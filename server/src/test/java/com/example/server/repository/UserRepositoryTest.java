package com.example.server.repository;

import com.example.server.model.Role;
import com.example.server.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    // Helper so each test doesn't repeat the same setup boilerplate.
    private User createUser(String username) {
        User user = new User("Password123");
        user.setUsername(username);
        return userRepository.save(user);
    }

    // findByUsername

    @Test
    public void findByUsername_returnsUserWhenExists() {
        createUser("TestUser");
        User found = userRepository.findByUsername("TestUser");
        assertThat(found).isNotNull();
        assertThat(found.getUsername()).isEqualTo("TestUser");
    }

    @Test
    public void findByUsername_returnsNullWhenNotExists() {
        User found = userRepository.findByUsername("NoSuchUser");
        assertThat(found).isNull();
    }

    // existsByUsername

    @Test
    public void existsByUsername_returnsTrueWhenExists() {
        createUser("ExistingUser");
        assertThat(userRepository.existsByUsername("ExistingUser")).isTrue();
    }

    @Test
    public void existsByUsername_returnsFalseWhenNotExists() {
        assertThat(userRepository.existsByUsername("GhostUser")).isFalse();
    }

    // countByRole

    @Test
    public void countByRole_countsCorrectly() {
        User user = createUser("RoleUser");
        user.setRole(Role.USER);
        userRepository.save(user);

        Long count = userRepository.countByRole(Role.USER);
        assertThat(count).isGreaterThanOrEqualTo(1);
    }

    // countByLastActiveAtGreaterThan

    @Test
    public void countByLastActiveAtGreaterThan_countsActiveUsers() {
        User user = createUser("ActiveUser");
        user.setLastActiveAt(Instant.now());
        userRepository.save(user);

        Long count = userRepository.countByLastActiveAtGreaterThan(Instant.now().minusSeconds(60));
        assertThat(count).isGreaterThanOrEqualTo(1);
    }

    @Test
    public void countByLastActiveAtGreaterThan_excludesOldUsers() {
        User user = createUser("OldUser");
        user.setLastActiveAt(Instant.now().minusSeconds(120));
        userRepository.save(user);

        // Cutoff is 60 seconds ago — this user's last active was 120s ago so should not be counted.
        Long count = userRepository.countByLastActiveAtGreaterThan(Instant.now().minusSeconds(60));
        assertThat(count).isEqualTo(0);
    }

    // findTop10ByOrderByCreatedAtDesc

    @Test
    public void findTop10ByOrderByCreatedAtDesc_returnsAtMostTen() {
        for (int i = 1; i <= 12; i++) {
            createUser("User" + i);
        }
        List<User> top10 = userRepository.findTop10ByOrderByCreatedAtDesc();
        assertThat(top10).hasSizeLessThanOrEqualTo(10);
    }
}