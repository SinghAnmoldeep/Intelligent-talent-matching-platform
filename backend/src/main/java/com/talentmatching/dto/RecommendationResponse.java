package com.talentmatching.dto;

// DTO for recommendation results
public class RecommendationResponse {

    private Long id;
    private String type;
    private String title;
    private String subtitle;
    private String description;
    private Integer matchScore;

    // Default constructor required for serialization
    public RecommendationResponse() {
    }

    // Constructor with all fields
    public RecommendationResponse(Long id, String type, String title,
                                  String subtitle, String description,
                                  Integer matchScore) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.matchScore = matchScore;
    }

    // Getter for id
    public Long getId() {
        return id;
    }

    // Setter for id
    public void setId(Long id) {
        this.id = id;
    }

    // Getter for type
    public String getType() {
        return type;
    }

    // Setter for type
    public void setType(String type) {
        this.type = type;
    }

    // Getter for title
    public String getTitle() {
        return title;
    }

    // Setter for title
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter for subtitle
    public String getSubtitle() {
        return subtitle;
    }

    // Setter for subtitle
    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    // Getter for description
    public String getDescription() {
        return description;
    }

    // Setter for description
    public void setDescription(String description) {
        this.description = description;
    }

    // Getter for matchScore
    public Integer getMatchScore() {
        return matchScore;
    }

    // Setter for matchScore
    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
    }
}
