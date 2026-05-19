package com.talentmatching.controller;

import com.talentmatching.dto.AuthResponse;
import com.talentmatching.dto.LoginRequest;
import com.talentmatching.dto.SignupRequest;
import com.talentmatching.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // Login endpoint returns message + JWT token.
    // Returns HTTP 401 (UNAUTHORIZED) when the email is not found or the
    // password does not match, so the frontend can distinguish failure
    // from success without parsing the message body. The AuthResponse body
    // is still returned on failure so the frontend can show result.message.
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        // Success path: token is populated on a successful login only.
        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
