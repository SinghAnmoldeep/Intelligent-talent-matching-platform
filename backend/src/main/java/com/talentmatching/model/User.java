package com.talentmatching.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;

// Entity represents a user account in the system
@Entity
@Table(name = "users")
public class User {

    // Primary key for user table
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Full name of the user
    @Column(nullable = false)
    private String fullName;

    // Email used for login, should be unique
    @Column(nullable = false, unique = true)
    private String email;

    // Hashed password
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    // User role: CANDIDATE or EMPLOYER
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Membership tier (Week 8 change). BASIC by default, PREMIUM for paid members.
    @Enumerated(EnumType.STRING)
    @Column(name = "membership_status", nullable = false)
    private MembershipStatus membershipStatus = MembershipStatus.BASIC;

    // Membership expiry date. Null when user is on BASIC tier.
    @Column(name = "membership_expiry")
    private LocalDate membershipExpiry;

    // Default constructor required by JPA
    public User() {
    }

    // Constructor without id
    public User(String fullName, String email, String password, Role role) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.membershipStatus = MembershipStatus.BASIC;
    }

    // Getter for id
    public Long getId() {
        return id;
    }

    // Setter for id
    public void setId(Long id) {
        this.id = id;
    }

    // Getter for fullName
    public String getFullName() {
        return fullName;
    }

    // Setter for fullName
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    // Getter for email
    public String getEmail() {
        return email;
    }

    // Setter for email
    public void setEmail(String email) {
        this.email = email;
    }

    // Getter for password
    public String getPassword() {
        return password;
    }

    // Setter for password
    public void setPassword(String password) {
        this.password = password;
    }

    // Getter for role
    public Role getRole() {
        return role;
    }

    // Setter for role
    public void setRole(Role role) {
        this.role = role;
    }

    // Getter for membershipStatus
    public MembershipStatus getMembershipStatus() {
        return membershipStatus;
    }

    // Setter for membershipStatus
    public void setMembershipStatus(MembershipStatus membershipStatus) {
        this.membershipStatus = membershipStatus;
    }

    // Getter for membershipExpiry
    public LocalDate getMembershipExpiry() {
        return membershipExpiry;
    }

    // Setter for membershipExpiry
    public void setMembershipExpiry(LocalDate membershipExpiry) {
        this.membershipExpiry = membershipExpiry;
    }

    // Convenience method - returns true if the user is currently a paying premium member
    public boolean isPremiumMember() {
        if (membershipStatus != MembershipStatus.PREMIUM) {
            return false;
        }
        return membershipExpiry == null || !membershipExpiry.isBefore(LocalDate.now());
    }
}
