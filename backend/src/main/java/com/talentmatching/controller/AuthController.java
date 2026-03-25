package com.talentmatching.controller;

import com.talentmatching.dto.AuthResponse;
import com.talentmatching.dto.LoginRequest;
import com.talentmatching.dto.SignupRequest;
import com.talentmatching.service.AuthService;
import org.springframework.web.bind.annotation.*;

// REST controller for authentication endpoints
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Signup endpoint
    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    // Login endpoint returns message + JWT token
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}