package com.talentmatching.dto;

// DTO returned by the search endpoints. Works for both jobs and candidates -
// `type` discriminates ("JOB" or "CANDIDATE") and `score` is the fuzzy
// similarity score between the query and the row (1.0 for an exact match).
public class SearchResultResponse {

    private Long id;
    private String type;       // "JOB" or "CANDIDATE"
    private String title;      // job title or candidate full name
    private String subtitle;   // company name or candidate email
    private String summary;    // short description (skills, location, etc.)
    private double score;      // 0.0 - 1.0, higher = better match

    public SearchResultResponse() {
    }

    public SearchResultResponse(Long id,
                                String type,
                                String title,
                                String subtitle,
                                String summary,
                                double score) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.subtitle = subtitle;
        this.summary = summary;
        this.score = score;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}