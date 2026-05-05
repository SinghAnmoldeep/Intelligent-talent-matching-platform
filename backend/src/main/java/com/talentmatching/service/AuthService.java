package com.talentmatching.service;

import com.talentmatching.dto.AuthResponse;
import com.talentmatching.dto.LoginRequest;
import com.talentmatching.dto.SignupRequest;
import com.talentmatching.model.MembershipStatus;
import com.talentmatching.model.User;
import com.talentmatching.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

// Service class for authentication-related business logic
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Register a new user (defaults to BASIC membership tier)
    public String signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email is already registered.";
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        // Membership defaults to BASIC via the entity default but we set it
        // explicitly here so the value is obvious to anyone reading the flow.
        user.setMembershipStatus(MembershipStatus.BASIC);

        userRepository.save(user);

        return "Signup successful.";
    }

    // Login existing user and return token response with membership claim
    public AuthResponse login(LoginRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return new AuthResponse("User not found.", null);
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse("Invalid password.", null);
        }

        String token = jwtService.generateToken(user.getEmail(), user.getMembershipStatus());

        return new AuthResponse(
                "Login successful.",
                token,
                user.getRole().name(),
                user.getMembershipStatus().name()
        );
    }

    // Helper method to fetch user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
