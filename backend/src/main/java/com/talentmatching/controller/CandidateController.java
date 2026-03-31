package com.talentmatching.controller;

import com.talentmatching.dto.CandidateProfileRequest;
import com.talentmatching.model.CandidateProfile;
import com.talentmatching.service.CandidateService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

// REST controller for candidate-related endpoints
@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    // Create or update candidate profile for logged-in user
    @PostMapping("/profile")
    public String createOrUpdateProfile(Authentication authentication,
                                        @RequestBody CandidateProfileRequest request) {

        String email = authentication.getName();
        return candidateService.createOrUpdateProfile(email, request);
    }

    // Get candidate profile for logged-in user
    @GetMapping("/profile")
    public CandidateProfile getProfile(Authentication authentication) {

        String email = authentication.getName();
        return candidateService.getProfileByEmail(email);
    }
}