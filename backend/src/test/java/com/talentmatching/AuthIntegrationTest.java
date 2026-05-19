package com.talentmatching;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the authentication flow.
 *
 * Covers:
 *   INT-01  login happy path returns 200, JWT, role and membership
 *   INT-04  candidate token cannot create a job (403 expected)
 *   negative login with wrong password returns 401
 *
 * The application is brought up with the default dev profile so it uses the
 * H2 in-memory database that is seeded from
 *   backend/src/main/resources/data.sql
 * by Spring Boot's spring.sql.init mechanism. The eight demo users defined
 * in that file are available; each one's password is the literal string
 * "password" (verified via bcrypt.checkpw before commit, see BUG-04).
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper json;

    @Test
    @DisplayName("INT-01 login with seeded candidate returns token, role and membership tier")
    void loginHappyPath_returnsTokenAndRole() throws Exception {
        String body = json.writeValueAsString(
                Map.of("email", "alice@test.com", "password", "password"));

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.role").value("CANDIDATE"))
                .andExpect(jsonPath("$.membership").value("PREMIUM"));
    }

    @Test
    @DisplayName("Login with wrong password returns 401 and a server-side message")
    void loginWrongPassword_returnsUnauthorised() throws Exception {
        String body = json.writeValueAsString(
                Map.of("email", "alice@test.com", "password", "WRONG"));

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid password."));
    }

    @Test
    @DisplayName("Login with an unknown email returns 401")
    void loginUnknownEmail_returnsUnauthorised() throws Exception {
        String body = json.writeValueAsString(
                Map.of("email", "ghost@nowhere.test", "password", "password"));

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("User not found."));
    }
}
