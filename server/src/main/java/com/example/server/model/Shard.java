package com.example.server.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.List;


@Entity
public class Shard {

    @Id
    private Integer id;
    private String title;
    @ElementCollection
    private List<String> context_text;
    private String rewardsText;             // Confusion on types...
    private String puzzleType;
    private Integer trackNumber;
    private boolean isUnlocked;            // If isCompleted True then isUnlocked true for shard+1.
    private boolean isCompleted = false;

    public Shard(Integer id, String title, List<String> context_text,
                 String rewardsText, String puzzleType, boolean isUnlocked) {
        this.id = id;
        this.title = title;
        this.context_text = context_text;
        this.rewardsText = rewardsText;
        this.puzzleType = puzzleType;
        this.isUnlocked = isUnlocked;
        this.setTrackNumber(this.id);
    }

    public Shard() {

    }

    // Setting trackNumber
    public void setTrackNumber (Integer id) {
        switch (id) {
            case 1, 2, 3:
                this.trackNumber = 1;
                break;
            case 4, 5, 6:
                this.trackNumber = 2;
                break;
            case 7, 8, 9:
                this.trackNumber = 3;
                break;
            default:
                throw new IllegalArgumentException("Invalid track ID: " + id);
        }
    }

    // GETTERS AND SETTERS
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getContext_text() {
        return context_text;
    }

    public void setContext_text(List<String> context_text) {
        this.context_text = context_text;
    }

    public String getRewardsText() {
        return rewardsText;
    }

    public void setRewardsText(String rewardsText) {
        this.rewardsText = rewardsText;
    }

    public String getPuzzleType() {
        return puzzleType;
    }

    public void setPuzzleType(String puzzleType) {
        this.puzzleType = puzzleType;
    }

    public Integer getTrackNumber() {
        return trackNumber;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public boolean isUnlocked() {
        return isUnlocked;
    }

    public void setUnlocked(boolean unlocked) {
        isUnlocked = unlocked;
    }
}
