package com.talentmatching.service;

import com.talentmatching.dto.SearchResultResponse;
import com.talentmatching.model.CandidateProfile;
import com.talentmatching.model.Job;
import com.talentmatching.repository.CandidateProfileRepository;
import com.talentmatching.repository.JobRepository;
import jakarta.persistence.criteria.Predicate;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

// Service implementing the Week 8 search requirement.
// Supports keyword, filter, keyword + filter, and fuzzy modes.
@Service
public class SearchService {

    // Jaro-Winkler is good for short text like job titles + skill tokens.
    private static final JaroWinklerSimilarity JW = new JaroWinklerSimilarity();

    // Rows below this similarity are dropped when fuzzy mode is on.
    private static final double FUZZY_THRESHOLD = 0.85;

    private final JobRepository jobRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    public SearchService(JobRepository jobRepository,
                         CandidateProfileRepository candidateProfileRepository) {
        this.jobRepository = jobRepository;
        this.candidateProfileRepository = candidateProfileRepository;
    }

    // -----------------------------------------------------------------
    // Job search
    // -----------------------------------------------------------------
    public Page<SearchResultResponse> searchJobs(String q,
                                                 String location,
                                                 String jobType,
                                                 String workMode,
                                                 boolean fuzzy,
                                                 int page,
                                                 int size) {

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));

        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (notBlank(q) && !fuzzy) {
                String like = "%" + q.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("jobTitle")), like),
                        cb.like(cb.lower(root.get("description")), like),
                        cb.like(cb.lower(root.get("requiredSkills")), like)
                ));
            }
            if (notBlank(location)) {
                predicates.add(cb.equal(cb.lower(root.get("location")), location.toLowerCase()));
            }
            if (notBlank(workMode)) {
                predicates.add(cb.equal(cb.lower(root.get("workMode")), workMode.toLowerCase()));
            }

            return predicates.isEmpty() ? null : cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Job> filtered = jobRepository.findAll(spec);

        List<SearchResultResponse> results = new ArrayList<>();
        for (Job job : filtered) {
            double score = fuzzy ? fuzzyScore(q, jobHaystack(job)) : 1.0;
            if (fuzzy && score < FUZZY_THRESHOLD) continue;
            results.add(new SearchResultResponse(
                    job.getId(),
                    "JOB",
                    job.getJobTitle(),
                    job.getCompanyName(),
                    jobSummary(job),
                    score
            ));
        }

        results.sort(Comparator.comparingDouble(SearchResultResponse::getScore).reversed());
        return paginate(results, pageable);
    }

    // -----------------------------------------------------------------
    // Candidate search (employer only)
    // -----------------------------------------------------------------
    public Page<SearchResultResponse> searchCandidates(String q,
                                                       String skills,
                                                       Integer minExperience,
                                                       String preferredMode,
                                                       String preferredLocation,
                                                       boolean fuzzy,
                                                       int page,
                                                       int size) {

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));

        Specification<CandidateProfile> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (notBlank(q) && !fuzzy) {
                String like = "%" + q.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("major")), like),
                        cb.like(cb.lower(root.get("skills")), like),
                        cb.like(cb.lower(root.get("workExperience")), like)
                ));
            }
            if (notBlank(skills)) {
                predicates.add(cb.like(cb.lower(root.get("skills")), "%" + skills.toLowerCase() + "%"));
            }
            if (minExperience != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("yearsOfExperience"), minExperience));
            }
            if (notBlank(preferredMode)) {
                predicates.add(cb.equal(cb.lower(root.get("preferredWorkMode")), preferredMode.toLowerCase()));
            }
            if (notBlank(preferredLocation)) {
                predicates.add(cb.equal(cb.lower(root.get("preferredLocation")), preferredLocation.toLowerCase()));
            }

            return predicates.isEmpty() ? null : cb.and(predicates.toArray(new Predicate[0]));
        };

        List<CandidateProfile> filtered = candidateProfileRepository.findAll(spec);

        List<SearchResultResponse> results = new ArrayList<>();
        for (CandidateProfile profile : filtered) {
            double score = fuzzy ? fuzzyScore(q, candidateHaystack(profile)) : 1.0;
            if (fuzzy && score < FUZZY_THRESHOLD) continue;
            results.add(new SearchResultResponse(
                    profile.getId(),
                    "CANDIDATE",
                    profile.getUser().getFullName(),
                    profile.getUser().getEmail(),
                    candidateSummary(profile),
                    score
            ));
        }

        results.sort(Comparator.comparingDouble(SearchResultResponse::getScore).reversed());
        return paginate(results, pageable);
    }

    // -----------------------------------------------------------------
    // Fuzzy scoring helpers
    // -----------------------------------------------------------------
    private double fuzzyScore(String query, String haystack) {
        if (!notBlank(query) || !notBlank(haystack)) return 0.0;
        String[] qTokens = query.toLowerCase().split("\\W+");
        String[] hTokens = haystack.toLowerCase().split("\\W+");

        double max = 0.0;
        for (String qt : qTokens) {
            if (qt.isEmpty()) continue;
            for (String ht : hTokens) {
                if (ht.isEmpty()) continue;
                double s = JW.apply(qt, ht);
                if (s > max) max = s;
            }
        }
        return max;
    }

    private String jobHaystack(Job job) {
        return safe(job.getJobTitle()) + " "
                + safe(job.getCompanyName()) + " "
                + safe(job.getDescription()) + " "
                + safe(job.getRequiredSkills()) + " "
                + safe(job.getLocation()) + " "
                + safe(job.getWorkMode());
    }

    private String candidateHaystack(CandidateProfile profile) {
        return safe(profile.getMajor()) + " "
                + safe(profile.getEducation()) + " "
                + safe(profile.getSkills()) + " "
                + safe(profile.getWorkExperience()) + " "
                + safe(profile.getPreferredLocation()) + " "
                + safe(profile.getPreferredWorkMode());
    }

    private String jobSummary(Job job) {
        List<String> parts = new ArrayList<>();
        if (notBlank(job.getLocation())) parts.add(job.getLocation());
        if (notBlank(job.getWorkMode())) parts.add(job.getWorkMode());
        if (notBlank(job.getRequiredSkills())) parts.add(job.getRequiredSkills());
        return String.join(" | ", parts);
    }

    private String candidateSummary(CandidateProfile profile) {
        List<String> parts = new ArrayList<>();
        if (notBlank(profile.getEducation())) parts.add(profile.getEducation());
        if (profile.getYearsOfExperience() != null) parts.add(profile.getYearsOfExperience() + " years");
        if (notBlank(profile.getSkills())) parts.add(profile.getSkills());
        return String.join(" | ", parts);
    }

    private <T> Page<T> paginate(List<T> all, Pageable pageable) {
        int from = Math.min((int) pageable.getOffset(), all.size());
        int to = Math.min(from + pageable.getPageSize(), all.size());
        return new PageImpl<>(all.subList(from, to), pageable, all.size());
    }

    private static boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }

    private static String safe(String s) {
        return s == null ? "" : s;
    }
}