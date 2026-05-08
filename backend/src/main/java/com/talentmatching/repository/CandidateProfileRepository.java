package com.talentmatching.repository;

import com.talentmatching.model.CandidateProfile;
import com.talentmatching.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

// Repository for CandidateProfile entity.
// Extends JpaSpecificationExecutor so SearchService can build dynamic
// filter predicates (skills/preferred mode/etc.) for candidate search.
public interface CandidateProfileRepository
        extends JpaRepository<CandidateProfile, Long>, JpaSpecificationExecutor<CandidateProfile> {

    // Find candidate profile by user
    Optional<CandidateProfile> findByUser(User user);
}