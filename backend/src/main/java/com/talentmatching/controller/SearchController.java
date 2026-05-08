package com.talentmatching.controller;

import com.talentmatching.dto.SearchResultResponse;
import com.talentmatching.service.SearchService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// REST controller for the Week 8 search feature.
// Exposes /api/search/jobs and /api/search/candidates with optional filters
// and a fuzzy toggle.
@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/jobs")
    public ResponseEntity<Page<SearchResultResponse>> searchJobs(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String location,
            @RequestParam(name = "job_type", required = false) String jobType,
            @RequestParam(name = "work_mode", required = false) String workMode,
            @RequestParam(defaultValue = "false") boolean fuzzy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                searchService.searchJobs(q, location, jobType, workMode, fuzzy, page, size)
        );
    }

    @GetMapping("/candidates")
    @PreAuthorize("hasAuthority('EMPLOYER')")
    public ResponseEntity<Page<SearchResultResponse>> searchCandidates(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String skills,
            @RequestParam(name = "min_experience", required = false) Integer minExperience,
            @RequestParam(name = "preferred_mode", required = false) String preferredMode,
            @RequestParam(name = "preferred_location", required = false) String preferredLocation,
            @RequestParam(defaultValue = "false") boolean fuzzy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                searchService.searchCandidates(q, skills, minExperience, preferredMode, preferredLocation, fuzzy, page, size)
        );
    }
}