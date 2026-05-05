package com.talentmatching.controller;

import com.talentmatching.dto.MembershipResponse;
import com.talentmatching.service.MembershipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// REST controller exposing the membership feature added in Week 8.
// Authenticated identity is taken from the JWT-populated SecurityContext.
@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    // Read current tier + expiry for the authenticated user
    @GetMapping("/status")
    public ResponseEntity<MembershipResponse> getStatus(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(membershipService.getStatus(email));
    }

    // Mock upgrade to PREMIUM (no real payment for the academic project).
    // Returns a refreshed JWT so the membership claim is propagated immediately.
    @PostMapping("/upgrade")
    public ResponseEntity<MembershipResponse> upgrade(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(membershipService.upgrade(email));
    }

    // Cancel premium and return to BASIC tier
    @PostMapping("/cancel")
    public ResponseEntity<MembershipResponse> cancel(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(membershipService.cancel(email));
    }
}
