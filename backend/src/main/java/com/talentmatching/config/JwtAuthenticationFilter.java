package com.talentmatching.config;

import com.talentmatching.model.User;
import com.talentmatching.repository.UserRepository;
import com.talentmatching.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

// JWT filter that runs once per request.
// Populates SecurityContext with the authenticated user's role as an authority
// so @PreAuthorize("hasAuthority('EMPLOYER')") and similar guards work.
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final UserRepository userRepository;

    // Constructor injection
    public JwtAuthenticationFilter(JwtService jwtService,
                                   UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Read Authorization header
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // If no header or header doesn't start with Bearer, continue request
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token after "Bearer "
        jwt = authHeader.substring(7);

        try {
            // Extract email from token
            userEmail = jwtService.extractEmail(jwt);

            // If email found and user is not already authenticated
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Validate token
                if (jwtService.isTokenValid(jwt, userEmail)) {

                    // Load the user from DB so we know their role.
                    // The role is published as a Spring authority so @PreAuthorize
                    // expressions like hasAuthority('EMPLOYER') work in controllers.
                    Optional<User> optionalUser = userRepository.findByEmail(userEmail);
                    List<SimpleGrantedAuthority> authorities = optionalUser
                            .map(u -> List.of(new SimpleGrantedAuthority(u.getRole().name())))
                            .orElse(Collections.emptyList());

                    // Create authentication object with the user's authorities
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userEmail,
                                    null,
                                    authorities
                            );

                    // Attach request details
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // Set authentication in security context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token is invalid / expired / malformed. We deliberately do NOT
            // abort the chain here - downstream filters (Spring Security's
            // anonymous filter etc.) will reject protected endpoints with 401
            // on their own. Log at DEBUG so the issue is visible during dev
            // but does not pollute production logs.
            log.debug("Invalid JWT: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
