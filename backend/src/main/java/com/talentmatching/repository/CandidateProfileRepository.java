package com.talentmatching.repository;

import com.talentmatching.model.CandidateProfile;
import com.talentmatching.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Repository for CandidateProfile entity
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {

    // Find candidate profile by user
    Optional<CandidateProfile> findByUser(User user);
}