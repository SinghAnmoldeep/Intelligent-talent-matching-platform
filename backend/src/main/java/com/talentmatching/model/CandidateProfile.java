package com.talentmatching.model;

import jakarta.persistence.*;

// Entity represents additional candidate profile details
@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile {

    // Primary key for candidate profile table
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link candidate profile with user account
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Contact details of candidate
    @Column(nullable = false)
    private String contactNumber;

    // Highest education details
    @Column(nullable = false)
    private String education;

    // Candidate major / specialization
    @Column(nullable = false)
    private String major;

    // Years of experience
    @Column(nullable = false)
    private Integer yearsOfExperience;

    // Skills stored as plain text for now
    @Column(nullable = false, length = 1000)
    private String skills;

    // Preferred job location
    private String preferredLocation;

    // Preferred work mode: remote / onsite / hybrid
    private String preferredWorkMode;

    // Default constructor required by JPA
    public CandidateProfile() {
    }

    // Constructor without id
    public CandidateProfile(User user, String contactNumber, String education, String major,
                            Integer yearsOfExperience, String skills,
                            String preferredLocation, String preferredWorkMode) {
        this.user = user;
        this.contactNumber = contactNumber;
        this.education = education;
        this.major = major;
        this.yearsOfExperience = yearsOfExperience;
        this.skills = skills;
        this.preferredLocation = preferredLocation;
        this.preferredWorkMode = preferredWorkMode;
    }

    // Getter for id
    public Long getId() {
        return id;
    }

    // Setter for id
    public void setId(Long id) {
        this.id = id;
    }

    // Getter for user
    public User getUser() {
        return user;
    }

    // Setter for user
    public void setUser(User user) {
        this.user = user;
    }

    // Getter for contactNumber
    public String getContactNumber() {
        return contactNumber;
    }

    // Setter for contactNumber
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    // Getter for education
    public String getEducation() {
        return education;
    }

    // Setter for education
    public void setEducation(String education) {
        this.education = education;
    }

    // Getter for major
    public String getMajor() {
        return major;
    }

    // Setter for major
    public void setMajor(String major) {
        this.major = major;
    }

    // Getter for yearsOfExperience
    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    // Setter for yearsOfExperience
    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    // Getter for skills
    public String getSkills() {
        return skills;
    }

    // Setter for skills
    public void setSkills(String skills) {
        this.skills = skills;
    }

    // Getter for preferredLocation
    public String getPreferredLocation() {
        return preferredLocation;
    }

    // Setter for preferredLocation
    public void setPreferredLocation(String preferredLocation) {
        this.preferredLocation = preferredLocation;
    }

    // Getter for preferredWorkMode
    public String getPreferredWorkMode() {
        return preferredWorkMode;
    }

    // Setter for preferredWorkMode
    public void setPreferredWorkMode(String preferredWorkMode) {
        this.preferredWorkMode = preferredWorkMode;
    }
}