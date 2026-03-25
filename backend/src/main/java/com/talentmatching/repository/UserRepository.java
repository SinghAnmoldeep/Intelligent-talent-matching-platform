package com.talentmatching.repository;

import com.talentmatching.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Repository for User entity
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used in login)
    Optional<User> findByEmail(String email);

    // Check if email already exists (used in signup)
    boolean existsByEmail(String email);
}