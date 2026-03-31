package com.talentmatching.model;

import jakarta.persistence.*;

// Entity represents additional employer profile details
@Entity
@Table(name = "employer_profiles")
public class Employer {

    // Primary key for employer profile table
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link employer profile with user account
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Company name of employer
    @Column(nullable = false)
    private String companyName;

    // Contact email for employer profile
    @Column(nullable = false)
    private String contactEmail;

    // Company industry
    @Column(nullable = false)
    private String industry;

    // Default constructor required by JPA
    public Employer() {
    }

    // Constructor without id
    public Employer(User user, String companyName, String contactEmail, String industry) {
        this.user = user;
        this.companyName = companyName;
        this.contactEmail = contactEmail;
        this.industry = industry;
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

    // Getter for companyName
    public String getCompanyName() {
        return companyName;
    }

    // Setter for companyName
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    // Getter for contactEmail
    public String getContactEmail() {
        return contactEmail;
    }

    // Setter for contactEmail
    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    // Getter for industry
    public String getIndustry() {
        return industry;
    }

    // Setter for industry
    public void setIndustry(String industry) {
        this.industry = industry;
    }
}

