package com.example.server.repository;

import com.example.server.model.UserShardProgress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserShardProgressRepository extends JpaRepository<UserShardProgress, Integer> {
}
