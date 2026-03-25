package com.talentmatching.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    // Default constructor required by JPA
    public User() {
    }

    // Constructor without id
    public User(String fullName, String email, String password, Role role) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
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
}
