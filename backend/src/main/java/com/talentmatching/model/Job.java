package com.talentmatching.model;

import jakarta.persistence.*;

// Entity represents a job posting created by an employer
@Entity
@Table(name = "job_postings")
public class Job {

    // Primary key for job table
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link job posting with employer user account
    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;

    // Job title
    @Column(nullable = false)
    private String jobTitle;

    // Company name shown in the job posting
    @Column(nullable = false)
    private String companyName;

    // Main job description
    @Column(nullable = false, length = 2000)
    private String description;

    // Required education level
    private String requiredEducation;

    // Required skills stored as plain text for now
    @Column(length = 1000)
    private String requiredSkills;

    // Minimum years of experience required
    @Column(nullable = false)
    private Integer yearsOfExperience;

    // Work mode: remote / onsite / hybrid
    @Column(nullable = false)
    private String workMode;

    // Job location
    private String location;

    // Default constructor required by JPA
    public Job() {
    }

    // Constructor without id
    public Job(User employer, String jobTitle, String companyName, String description,
               String requiredEducation, String requiredSkills,
               Integer yearsOfExperience, String workMode, String location) {
        this.employer = employer;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.description = description;
        this.requiredEducation = requiredEducation;
        this.requiredSkills = requiredSkills;
        this.yearsOfExperience = yearsOfExperience;
        this.workMode = workMode;
        this.location = location;
    }

    // Getter for id
    public Long getId() {
        return id;
    }

    // Setter for id
    public void setId(Long id) {
        this.id = id;
    }

    // Getter for employer
    public User getEmployer() {
        return employer;
    }

    // Setter for employer
    public void setEmployer(User employer) {
        this.employer = employer;
    }

    // Getter for jobTitle
    public String getJobTitle() {
        return jobTitle;
    }

    // Setter for jobTitle
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    // Getter for companyName
    public String getCompanyName() {
        return companyName;
    }

    // Setter for companyName
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    // Getter for description
    public String getDescription() {
        return description;
    }

    // Setter for description
    public void setDescription(String description) {
        this.description = description;
    }

    // Getter for requiredEducation
    public String getRequiredEducation() {
        return requiredEducation;
    }

    // Setter for requiredEducation
    public void setRequiredEducation(String requiredEducation) {
        this.requiredEducation = requiredEducation;
    }

    // Getter for requiredSkills
    public String getRequiredSkills() {
        return requiredSkills;
    }

    // Setter for requiredSkills
    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    // Getter for yearsOfExperience
    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    // Setter for yearsOfExperience
    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    // Getter for workMode
    public String getWorkMode() {
        return workMode;
    }

    // Setter for workMode
    public void setWorkMode(String workMode) {
        this.workMode = workMode;
    }

    // Getter for location
    public String getLocation() {
        return location;
    }

    // Setter for location
    public void setLocation(String location) {
        this.location = location;
    }
}
