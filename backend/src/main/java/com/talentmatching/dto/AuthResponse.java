package com.talentmatching.dto;

// DTO for authentication response
public class AuthResponse {

    private String message;
    private String token;
    private String role;
    // Membership tier surfaced so the frontend can show badge / unlock UI immediately
    private String membership;

    public AuthResponse() {
    }

    public AuthResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

    public AuthResponse(String message, String token, String role) {
        this.message = message;
        this.token = token;
        this.role = role;
    }

    public AuthResponse(String message, String token, String role, String membership) {
        this.message = message;
        this.token = token;
        this.role = role;
        this.membership = membership;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMembership() {
        return membership;
    }

    public void setMembership(String membership) {
        this.membership = membership;
    }
}
