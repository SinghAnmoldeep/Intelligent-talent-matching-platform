package com.talentmatching.repository;

import com.talentmatching.model.Employer;
import com.talentmatching.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Repository for Employer entity
public interface EmployerRepository extends JpaRepository<Employer, Long> {

    // Find employer profile by user
    Optional<Employer> findByUser(User user);
}
