package com.example.server.service;

import com.example.server.model.PuzzleContent;
import com.example.server.repository.PuzzleContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PuzzleContentService {
    private final PuzzleContentRepository puzzleContentRepository;

    public PuzzleContentService(PuzzleContentRepository puzzleContentRepository) {
        this.puzzleContentRepository = puzzleContentRepository;
    }

    public List<PuzzleContent> getPuzzlesByShard(Integer shardId) {
        return puzzleContentRepository.findByShardId(shardId);
    }
}