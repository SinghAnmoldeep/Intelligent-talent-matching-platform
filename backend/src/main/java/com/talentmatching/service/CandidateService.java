package com.talentmatching.service;

import com.talentmatching.dto.CandidateProfileRequest;
import com.talentmatching.model.CandidateProfile;
import com.talentmatching.model.User;
import com.talentmatching.repository.CandidateProfileRepository;
import com.talentmatching.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

// Service class for candidate profile business logic
@Service
public class CandidateService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;

    public CandidateService(CandidateProfileRepository candidateProfileRepository,
                            UserRepository userRepository) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.userRepository = userRepository;
    }

    // Create or update candidate profile using authenticated user's email
    public String createOrUpdateProfile(String email, CandidateProfileRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return "User not found.";
        }

        User user = optionalUser.get();

        Optional<CandidateProfile> optionalProfile = candidateProfileRepository.findByUser(user);

        CandidateProfile profile;

        if (optionalProfile.isPresent()) {
            profile = optionalProfile.get();
        } else {
            profile = new CandidateProfile();
            profile.setUser(user);
        }

        profile.setContactNumber(request.getContactNumber());
        profile.setEducation(request.getEducation());
        profile.setMajor(request.getMajor());
        profile.setYearsOfExperience(request.getYearsOfExperience());
        profile.setSkills(request.getSkills());
        profile.setWorkExperience(request.getWorkExperience());
        profile.setPreferredLocation(request.getPreferredLocation());
        profile.setPreferredWorkMode(request.getPreferredWorkMode());
        profile.setResumeText(request.getResumeText());

        candidateProfileRepository.save(profile);

        return "Candidate profile saved successfully.";
    }

    // Get candidate profile by authenticated user's email
    public CandidateProfile getProfileByEmail(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return null;
        }

        Optional<CandidateProfile> optionalProfile =
                candidateProfileRepository.findByUser(optionalUser.get());

        return optionalProfile.orElse(null);
    }
}
