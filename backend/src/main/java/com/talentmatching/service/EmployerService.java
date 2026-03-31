package com.talentmatching.service;

import com.talentmatching.dto.EmployerProfileRequest;
import com.talentmatching.model.Employer;
import com.talentmatching.model.User;
import com.talentmatching.repository.EmployerRepository;
import com.talentmatching.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

// Service class for employer profile business logic
@Service
public class EmployerService {

    private final EmployerRepository employerRepository;
    private final UserRepository userRepository;

    public EmployerService(EmployerRepository employerRepository,
                           UserRepository userRepository) {
        this.employerRepository = employerRepository;
        this.userRepository = userRepository;
    }

    // Create or update employer profile using authenticated user's email
    public String createOrUpdateProfile(String email, EmployerProfileRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return "User not found.";
        }

        User user = optionalUser.get();

        Optional<Employer> optionalEmployer = employerRepository.findByUser(user);

        Employer employer;

        if (optionalEmployer.isPresent()) {
            employer = optionalEmployer.get();
        } else {
            employer = new Employer();
            employer.setUser(user);
        }

        employer.setCompanyName(request.getCompanyName());
        employer.setContactEmail(request.getContactEmail());
        employer.setIndustry(request.getIndustry());

        employerRepository.save(employer);

        return "Employer profile saved successfully.";
    }

    // Get employer profile by authenticated user's email
    public Employer getProfileByEmail(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return null;
        }

        Optional<Employer> optionalEmployer =
                employerRepository.findByUser(optionalUser.get());

        return optionalEmployer.orElse(null);
    }
}
