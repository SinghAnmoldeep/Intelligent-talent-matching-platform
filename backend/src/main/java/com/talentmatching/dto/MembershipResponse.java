package com.talentmatching.dto;

import com.talentmatching.model.MembershipStatus;

import java.time.LocalDate;

// DTO returned by membership endpoints describing a user's tier + expiry
public class MembershipResponse {

    private String message;
    private MembershipStatus membershipStatus;
    private LocalDate membershipExpiry;
    private String token; // refreshed JWT after upgrade/cancel, null on plain status read

    public MembershipResponse() {
    }

    public MembershipResponse(String message,
                              MembershipStatus membershipStatus,
                              LocalDate membershipExpiry) {
        this.message = message;
        this.membershipStatus = membershipStatus;
        this.membershipExpiry = membershipExpiry;
    }

    public MembershipResponse(String message,
                              MembershipStatus membershipStatus,
                              LocalDate membershipExpiry,
                              String token) {
        this.message = message;
        this.membershipStatus = membershipStatus;
        this.membershipExpiry = membershipExpiry;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public MembershipStatus getMembershipStatus() {
        return membershipStatus;
    }

    public void setMembershipStatus(MembershipStatus membershipStatus) {
        this.membershipStatus = membershipStatus;
    }

    public LocalDate getMembershipExpiry() {
        return membershipExpiry;
    }

    public void setMembershipExpiry(LocalDate membershipExpiry) {
        this.membershipExpiry = membershipExpiry;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
