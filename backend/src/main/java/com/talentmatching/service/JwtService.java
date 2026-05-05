package com.talentmatching.service;

import com.talentmatching.model.MembershipStatus;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

// Service class for generating and validating JWT tokens
@Service
public class JwtService {

    // Claim key holding the user's membership tier (added in Week 8 change)
    public static final String MEMBERSHIP_CLAIM = "membership";

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Generate token using email as subject (legacy callers without membership info)
    public String generateToken(String email) {
        return generateToken(email, MembershipStatus.BASIC);
    }

    // Generate token using email as subject and include the membership claim
    public String generateToken(String email, MembershipStatus membershipStatus) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(MEMBERSHIP_CLAIM,
                membershipStatus == null ? MembershipStatus.BASIC.name() : membershipStatus.name());
        return createToken(claims, email);
    }

    // Read the membership claim from a token. Defaults to BASIC if missing or unreadable.
    public MembershipStatus extractMembership(String token) {
        try {
            Object value = extractAllClaims(token).get(MEMBERSHIP_CLAIM);
            if (value == null) {
                return MembershipStatus.BASIC;
            }
            return MembershipStatus.valueOf(value.toString());
        } catch (Exception e) {
            return MembershipStatus.BASIC;
        }
    }

    // Create token with claims and subject
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), Jwts.SIG.HS256)
                .compact();
    }

    // Extract email from token
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Validate token for given email
    public boolean isTokenValid(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return extractedEmail.equals(email) && !isTokenExpired(token);
    }

    // Check whether token is expired
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // Extract all claims
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Convert secret key string into SecretKey
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(java.util.Base64.getEncoder().encodeToString(secretKey.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
