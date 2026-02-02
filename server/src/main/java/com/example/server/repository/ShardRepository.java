package com.example.server.repository;

import com.example.server.model.Shard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShardRepository extends JpaRepository<Shard, Integer> {


}
