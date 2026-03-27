package com.talentmatching.controller;

import com.talentmatching.dto.RecommendationResponse;
import com.talentmatching.service.RecommendationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST controller for recommendation-related endpoints
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    // Return top job recommendations for the logged-in candidate
    @GetMapping("/jobs")
    public List<RecommendationResponse> getRecommendedJobs(Authentication authentication) {

        String email = authentication.getName();
        return recommendationService.getRecommendedJobs(email);
    }

    // Return top candidate recommendations for a job owned by the logged-in employer
    @GetMapping("/candidates/{jobId}")
    public List<RecommendationResponse> getRecommendedCandidates(Authentication authentication,
                                                                 @PathVariable Long jobId) {

        String email = authentication.getName();
        return recommendationService.getRecommendedCandidates(email, jobId);
    }
}

