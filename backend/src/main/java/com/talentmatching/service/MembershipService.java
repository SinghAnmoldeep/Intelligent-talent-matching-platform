package com.talentmatching.service;

import com.talentmatching.dto.MembershipResponse;
import com.talentmatching.model.MembershipStatus;
import com.talentmatching.model.User;
import com.talentmatching.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

// Service class for membership tier business logic.
// Added in Week 8 to satisfy the membership requirement change.
@Service
public class MembershipService {

    // Length of one membership cycle in days. Mock value for the academic project.
    private static final int MEMBERSHIP_PERIOD_DAYS = 30;

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public MembershipService(UserRepository userRepository,
                             JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // Read current membership status for the authenticated user
    public MembershipResponse getStatus(String email) {
        User user = findUserOrThrow(email);
        return new MembershipResponse(
                "Membership status retrieved.",
                user.getMembershipStatus(),
                user.getMembershipExpiry()
        );
    }

    // Upgrade user to PREMIUM tier and re-issue JWT so the new claim is in effect
    public MembershipResponse upgrade(String email) {
        User user = findUserOrThrow(email);

        user.setMembershipStatus(MembershipStatus.PREMIUM);
        user.setMembershipExpiry(LocalDate.now().plusDays(MEMBERSHIP_PERIOD_DAYS));
        userRepository.save(user);

        String refreshedToken = jwtService.generateToken(user.getEmail(), user.getMembershipStatus());

        return new MembershipResponse(
                "Upgraded to PREMIUM. Recommendations are now unlimited.",
                user.getMembershipStatus(),
                user.getMembershipExpiry(),
                refreshedToken
        );
    }

    // Cancel premium tier and re-issue JWT
    public MembershipResponse cancel(String email) {
        User user = findUserOrThrow(email);

        user.setMembershipStatus(MembershipStatus.BASIC);
        user.setMembershipExpiry(null);
        userRepository.save(user);

        String refreshedToken = jwtService.generateToken(user.getEmail(), user.getMembershipStatus());

        return new MembershipResponse(
                "Membership cancelled. Recommendations are capped at top 10.",
                user.getMembershipStatus(),
                user.getMembershipExpiry(),
                refreshedToken
        );
    }

    // Helper - look up user by email or throw if not found
    private User findUserOrThrow(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new IllegalStateException("Authenticated user " + email + " not found in DB.");
        }
        return optionalUser.get();
    }
}
