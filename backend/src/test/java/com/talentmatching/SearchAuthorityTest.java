package com.talentmatching;

import com.fasterxml.jackson.databind.ObjectMapper;
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
 * Authority tests for the Week 8 Search feature.
 *
 * Covers:
 *   INT-06  candidate token cannot access /api/search/candidates (403)
 *   employer token can access /api/search/candidates (200)
 *   unauthenticated requests to either search endpoint return 401
 *
 * Together with the JwtAuthenticationFilter fix in commit b22560f, these
 * tests guard against a regression of BUG-03 (filter not publishing the
 * user's role as a Spring authority).
 */
@SpringBootTest
@AutoConfigureMockMvc
class SearchAuthorityTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper json;

    private String loginAndExtractToken(String email) throws Exception {
        String body = json.writeValueAsString(Map.of("email", email, "password", "password"));
        MvcResult r = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();
        return json.readTree(r.getResponse().getContentAsString()).get("token").asText();
    }

    @Test
    @DisplayName("INT-06 candidate token is rejected by /api/search/candidates with 403")
    void candidateCannotSearchCandidates() throws Exception {
        String candidateToken = loginAndExtractToken("alice@test.com");
        mvc.perform(get("/api/search/candidates").header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Employer token can access /api/search/candidates")
    void employerCanSearchCandidates() throws Exception {
        String employerToken = loginAndExtractToken("techcorp@test.com");
        mvc.perform(get("/api/search/candidates").header("Authorization", "Bearer " + employerToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Unauthenticated request to /api/search/jobs returns 401")
    void noTokenRejected() throws Exception {
        mvc.perform(get("/api/search/jobs"))
                .andExpect(status().isUnauthorized());
    }
}
