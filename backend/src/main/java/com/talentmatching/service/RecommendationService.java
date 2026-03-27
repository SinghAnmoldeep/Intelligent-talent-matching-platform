package com.talentmatching.service;

import com.talentmatching.dto.RecommendationResponse;
import com.talentmatching.model.CandidateProfile;
import com.talentmatching.model.Job;
import com.talentmatching.model.Role;
import com.talentmatching.model.User;
import com.talentmatching.repository.CandidateProfileRepository;
import com.talentmatching.repository.JobRepository;
import com.talentmatching.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

// Service class for recommendation logic
@Service
public class RecommendationService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final JobRepository jobRepository;

    public RecommendationService(UserRepository userRepository,
                                 CandidateProfileRepository candidateProfileRepository,
                                 JobRepository jobRepository) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.jobRepository = jobRepository;
    }

    // Return the top recommended jobs for the authenticated candidate
    public List<RecommendationResponse> getRecommendedJobs(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty() || optionalUser.get().getRole() != Role.CANDIDATE) {
            return Collections.emptyList();
        }

        Optional<CandidateProfile> optionalProfile =
                candidateProfileRepository.findByUser(optionalUser.get());

        if (optionalProfile.isEmpty()) {
            return Collections.emptyList();
        }

        CandidateProfile profile = optionalProfile.get();
        List<RecommendationResponse> recommendations = new ArrayList<>();

        for (Job job : jobRepository.findAllByOrderByIdDesc()) {
            int score = calculateCandidateToJobScore(profile, job);

            if (score > 0) {
                recommendations.add(new RecommendationResponse(
                        job.getId(),
                        "JOB",
                        job.getJobTitle(),
                        job.getCompanyName(),
                        buildJobSummary(job),
                        score
                ));
            }
        }

        recommendations.sort(Comparator.comparing(RecommendationResponse::getMatchScore).reversed());

        return recommendations.stream().limit(10).collect(Collectors.toList());
    }

    // Return the top recommended candidates for a specific employer job
    public List<RecommendationResponse> getRecommendedCandidates(String email, Long jobId) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty() || optionalUser.get().getRole() != Role.EMPLOYER) {
            return Collections.emptyList();
        }

        Optional<Job> optionalJob = jobRepository.findByIdAndEmployer(jobId, optionalUser.get());

        if (optionalJob.isEmpty()) {
            return Collections.emptyList();
        }

        Job job = optionalJob.get();
        List<RecommendationResponse> recommendations = new ArrayList<>();

        for (CandidateProfile profile : candidateProfileRepository.findAll()) {
            int score = calculateCandidateToJobScore(profile, job);

            if (score > 0) {
                recommendations.add(new RecommendationResponse(
                        profile.getId(),
                        "CANDIDATE",
                        profile.getUser().getFullName(),
                        profile.getUser().getEmail(),
                        buildCandidateSummary(profile),
                        score
                ));
            }
        }

        recommendations.sort(Comparator.comparing(RecommendationResponse::getMatchScore).reversed());

        return recommendations.stream().limit(10).collect(Collectors.toList());
    }

    // Calculate recommendation score between a candidate profile and a job posting
    private int calculateCandidateToJobScore(CandidateProfile profile, Job job) {
        int score = 0;
        score += calculateSkillsScore(profile.getSkills(), job.getRequiredSkills(), 50);
        score += calculateEducationScore(profile.getEducation(), job.getRequiredEducation(), 15);
        score += calculateExperienceScore(profile.getYearsOfExperience(), job.getYearsOfExperience(), 15);
        score += calculateExactMatchScore(profile.getPreferredLocation(), job.getLocation(), 10);
        score += calculateExactMatchScore(profile.getPreferredWorkMode(), job.getWorkMode(), 10);
        return score;
    }

    // Calculate skill match score from comma-separated skill lists
    private int calculateSkillsScore(String candidateSkills, String requiredSkills, int maxPoints) {
        Set<String> candidateSkillSet = normalizeSkills(candidateSkills);
        Set<String> requiredSkillSet = normalizeSkills(requiredSkills);

        if (candidateSkillSet.isEmpty() || requiredSkillSet.isEmpty()) {
            return 0;
        }

        int matches = 0;

        for (String requiredSkill : requiredSkillSet) {
            if (candidateSkillSet.contains(requiredSkill)) {
                matches++;
            }
        }

        return (int) Math.round((double) matches / requiredSkillSet.size() * maxPoints);
    }

    // Calculate education match score, allowing higher degrees to satisfy lower requirements
    private int calculateEducationScore(String candidateEducation, String requiredEducation, int maxPoints) {
        if (requiredEducation == null || requiredEducation.isBlank()) {
            return maxPoints;
        }

        int candidateRank = mapEducationRank(candidateEducation);
        int requiredRank = mapEducationRank(requiredEducation);

        if (candidateRank == 0 || requiredRank == 0) {
            return 0;
        }

        return candidateRank >= requiredRank ? maxPoints : 0;
    }

    // Calculate score based on years of experience
    private int calculateExperienceScore(Integer candidateExperience, Integer requiredExperience, int maxPoints) {
        int candidateYears = candidateExperience == null ? 0 : candidateExperience;
        int requiredYears = requiredExperience == null ? 0 : requiredExperience;

        if (requiredYears <= 0) {
            return maxPoints;
        }

        if (candidateYears >= requiredYears) {
            return maxPoints;
        }

        return (int) Math.round((double) candidateYears / requiredYears * maxPoints);
    }

    // Calculate score for simple exact matches such as location or work mode
    private int calculateExactMatchScore(String candidateValue, String jobValue, int points) {
        if (candidateValue == null || jobValue == null ||
                candidateValue.isBlank() || jobValue.isBlank()) {
            return 0;
        }

        return candidateValue.trim().equalsIgnoreCase(jobValue.trim()) ? points : 0;
    }

    // Map education strings to a comparable level
    private int mapEducationRank(String education) {
        if (education == null) {
            return 0;
        }

        String normalized = education.trim().toLowerCase();

        return switch (normalized) {
            case "high school" -> 1;
            case "bachelor" -> 2;
            case "master" -> 3;
            case "phd" -> 4;
            default -> 0;
        };
    }

    // Normalize comma-separated skills into a lowercase set
    private Set<String> normalizeSkills(String skills) {
        if (skills == null || skills.isBlank()) {
            return Collections.emptySet();
        }

        return Arrays.stream(skills.split(","))
                .map(String::trim)
                .filter(skill -> !skill.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    // Build summary text for job recommendations
    private String buildJobSummary(Job job) {
        List<String> parts = new ArrayList<>();

        if (job.getLocation() != null && !job.getLocation().isBlank()) {
            parts.add(job.getLocation());
        }

        if (job.getWorkMode() != null && !job.getWorkMode().isBlank()) {
            parts.add(job.getWorkMode());
        }

        if (job.getRequiredSkills() != null && !job.getRequiredSkills().isBlank()) {
            parts.add(job.getRequiredSkills());
        }

        return String.join(" | ", parts);
    }

    // Build summary text for candidate recommendations
    private String buildCandidateSummary(CandidateProfile profile) {
        List<String> parts = new ArrayList<>();

        if (profile.getEducation() != null && !profile.getEducation().isBlank()) {
            parts.add(profile.getEducation());
        }

        if (profile.getYearsOfExperience() != null) {
            parts.add(profile.getYearsOfExperience() + " years");
        }

        if (profile.getSkills() != null && !profile.getSkills().isBlank()) {
            parts.add(profile.getSkills());
        }

        return String.join(" | ", parts);
    }
}
