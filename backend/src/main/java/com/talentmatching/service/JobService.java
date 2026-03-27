package com.talentmatching.service;

import com.talentmatching.dto.JobRequest;
import com.talentmatching.model.Job;
import com.talentmatching.model.Role;
import com.talentmatching.model.User;
import com.talentmatching.repository.JobRepository;
import com.talentmatching.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

// Service class for job posting business logic
@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository,
                      UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // Create a new job posting for the authenticated employer
    public String createJob(String email, JobRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return "User not found.";
        }

        User user = optionalUser.get();

        if (user.getRole() != Role.EMPLOYER) {
            return "Only employers can create job postings.";
        }

        Job job = new Job();
        job.setEmployer(user);
        applyRequest(job, request);

        jobRepository.save(job);

        return "Job posted successfully.";
    }

    // Return all jobs for browsing
    public List<Job> getAllJobs() {
        return jobRepository.findAllByOrderByIdDesc();
    }

    // Return all jobs created by the authenticated employer
    public List<Job> getMyJobs(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return Collections.emptyList();
        }

        return jobRepository.findByEmployerOrderByIdDesc(optionalUser.get());
    }

    // Get a single job by id
    public Job getJobById(Long jobId) {
        return jobRepository.findById(jobId).orElse(null);
    }

    // Update a job owned by the authenticated employer
    public String updateJob(String email, Long jobId, JobRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return "User not found.";
        }

        User user = optionalUser.get();

        if (user.getRole() != Role.EMPLOYER) {
            return "Only employers can update job postings.";
        }

        Optional<Job> optionalJob = jobRepository.findByIdAndEmployer(jobId, user);

        if (optionalJob.isEmpty()) {
            return "Job not found.";
        }

        Job job = optionalJob.get();
        applyRequest(job, request);

        jobRepository.save(job);

        return "Job updated successfully.";
    }

    // Delete a job owned by the authenticated employer
    public String deleteJob(String email, Long jobId) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return "User not found.";
        }

        User user = optionalUser.get();

        if (user.getRole() != Role.EMPLOYER) {
            return "Only employers can delete job postings.";
        }

        Optional<Job> optionalJob = jobRepository.findByIdAndEmployer(jobId, user);

        if (optionalJob.isEmpty()) {
            return "Job not found.";
        }

        jobRepository.delete(optionalJob.get());

        return "Job deleted successfully.";
    }

    // Copy request fields into the job entity
    private void applyRequest(Job job, JobRequest request) {
        job.setJobTitle(request.getJobTitle());
        job.setCompanyName(request.getCompanyName());
        job.setDescription(request.getDescription());
        job.setRequiredEducation(request.getRequiredEducation());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setYearsOfExperience(
                request.getYearsOfExperience() == null ? 0 : request.getYearsOfExperience()
        );
        job.setWorkMode(request.getWorkMode());
        job.setLocation(request.getLocation());
    }
}
