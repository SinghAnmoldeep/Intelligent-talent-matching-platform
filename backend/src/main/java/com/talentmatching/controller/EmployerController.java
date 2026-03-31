package com.talentmatching.controller;

import com.talentmatching.dto.EmployerProfileRequest;
import com.talentmatching.model.Employer;
import com.talentmatching.service.EmployerService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

// REST controller for employer-related endpoints
@RestController
@RequestMapping("/api/employer")
public class EmployerController {

    private final EmployerService employerService;

    public EmployerController(EmployerService employerService) {
        this.employerService = employerService;
    }

    // Create or update employer profile for logged-in user
    @PostMapping("/profile")
    public String createOrUpdateProfile(Authentication authentication,
                                        @RequestBody EmployerProfileRequest request) {

        String email = authentication.getName();
        return employerService.createOrUpdateProfile(email, request);
    }

    // Get employer profile for logged-in user
    @GetMapping("/profile")
    public Employer getProfile(Authentication authentication) {

        String email = authentication.getName();
        return employerService.getProfileByEmail(email);
    }
}
