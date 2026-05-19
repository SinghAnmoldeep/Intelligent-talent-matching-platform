package com.talentmatching.controller;

import com.talentmatching.dto.JobRequest;
import com.talentmatching.model.Job;
import com.talentmatching.service.JobService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST controller for job-related endpoints
@RestController
@RequestMapping("/api/job")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Create a new job posting for the logged-in employer.
    // EMPLOYER role enforced at the security layer so non-employers receive
    // an HTTP 403 instead of the previous 200 + error-string response.
    @PostMapping
    @PreAuthorize("hasAuthority('EMPLOYER')")
    public String createJob(Authentication authentication,
                            @RequestBody JobRequest request) {

        String email = authentication.getName();
        return jobService.createJob(email, request);
    }

    // Return all available job postings
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // Return all jobs created by the logged-in employer
    @GetMapping("/my-jobs")
    public List<Job> getMyJobs(Authentication authentication) {

        String email = authentication.getName();
        return jobService.getMyJobs(email);
    }

    // Return one job by id
    @GetMapping("/{jobId}")
    public Job getJobById(@PathVariable Long jobId) {
        return jobService.getJobById(jobId);
    }

    // Update a job owned by the logged-in employer (EMPLOYER role required)
    @PutMapping("/{jobId}")
    @PreAuthorize("hasAuthority('EMPLOYER')")
    public String updateJob(Authentication authentication,
                            @PathVariable Long jobId,
                            @RequestBody JobRequest request) {

        String email = authentication.getName();
        return jobService.updateJob(email, jobId, request);
    }

    // Delete a job owned by the logged-in employer (EMPLOYER role required)
    @DeleteMapping("/{jobId}")
    @PreAuthorize("hasAuthority('EMPLOYER')")
    public String deleteJob(Authentication authentication,
                            @PathVariable Long jobId) {

        String email = authentication.getName();
        return jobService.deleteJob(email, jobId);
    }
}
