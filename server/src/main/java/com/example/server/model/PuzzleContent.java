package com.example.server.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
public class PuzzleContent {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shard_id")
    private Shard shard;

    private String puzzleType;     // "FILL_IN_BLANK", "MULTIPLE_CHOICE", "MATCHING", "ORDERING", etc.
    private String question;
    private String correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String optionsJson;    // store choices/options as JSON string for flexible puzzle types

    public PuzzleContent() {
    }

    public PuzzleContent(Shard shard, String puzzleType, String question,
                         String correctAnswer, String optionsJson) {
        this.shard = shard;
        this.puzzleType = puzzleType;
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.optionsJson = optionsJson;
    }

    // GETTERS AND SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Shard getShard() {
        return shard;
    }

    public void setShard(Shard shard) {
        this.shard = shard;
    }

    public String getPuzzleType() {
        return puzzleType;
    }

    public void setPuzzleType(String puzzleType) {
        this.puzzleType = puzzleType;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getOptionsJson() {
        return optionsJson;
    }

    public void setOptionsJson(String optionsJson) {
        this.optionsJson = optionsJson;
    }
}