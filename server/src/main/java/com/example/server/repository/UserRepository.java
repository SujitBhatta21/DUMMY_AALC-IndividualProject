package com.example.server.repository;

import com.example.server.model.Role;
import com.example.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    User findByUsername(String username);
    Long countByRole(Role role);
    Long countByLastActiveAtGreaterThan(Instant cutoff);
    List<User> findTop10ByOrderByCreatedAtDesc();
}
