package com.talentmatching.repository;

import com.talentmatching.model.Job;
import com.talentmatching.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// Repository for Job entity
public interface JobRepository extends JpaRepository<Job, Long> {

    // Find all jobs ordered by newest first
    List<Job> findAllByOrderByIdDesc();

    // Find jobs posted by a specific employer
    List<Job> findByEmployerOrderByIdDesc(User employer);

    // Find one job by id and employer
    Optional<Job> findByIdAndEmployer(Long id, User employer);
}

