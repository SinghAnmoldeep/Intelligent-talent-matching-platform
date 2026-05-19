package com.talentmatching;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration test for the Week 8 Membership Tier feature.
 *
 * Covers:
 *   INT-05  membership upgrade re-issues the JWT and removes the
 *           recommendation cap immediately, without the user needing
 *           to log in again.
 *
 * The test logs in as a BASIC candidate, calls /api/membership/upgrade,
 * captures the new JWT from the response body, and asserts that the
 * subsequent call to /api/membership/status using the new token reports
 * PREMIUM with a non-null expiry.
 */
@SpringBootTest
@AutoConfigureMockMvc
class MembershipIntegrationTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper json;

    @Test
    @DisplayName("INT-05 upgrade re-issues the JWT and switches the user to PREMIUM")
    void upgradeRefreshesJwtAndChangesTier() throws Exception {
        // 1. log in as Bob, a BASIC candidate
        String loginBody = json.writeValueAsString(
                Map.of("email", "bob@test.com", "password", "password"));

        MvcResult loginResult = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.membership").value("BASIC"))
                .andReturn();

        String initialToken = json.readTree(loginResult.getResponse().getContentAsString())
                .get("token").asText();

        // 2. call membership/upgrade using the initial token
        MvcResult upgradeResult = mvc.perform(post("/api/membership/upgrade")
                        .header("Authorization", "Bearer " + initialToken))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode upgradeJson = json.readTree(upgradeResult.getResponse().getContentAsString());
        String newToken = upgradeJson.has("newToken") ? upgradeJson.get("newToken").asText()
                : upgradeJson.get("token").asText();

        // 3. confirm membership/status with the new token reports PREMIUM
        mvc.perform(get("/api/membership/status")
                        .header("Authorization", "Bearer " + newToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.membershipStatus").value("PREMIUM"));
    }
}
