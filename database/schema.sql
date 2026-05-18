-- =====================================================================
-- Talent Matching Platform - MySQL DDL (production reference).
--
-- This file is the canonical MySQL schema for production deployment.
-- It is NOT used for local development - dev uses H2 in-memory with
-- spring.jpa.hibernate.ddl-auto=update which generates the schema from
-- JPA entities. See backend/src/main/resources/data.sql for the dev seed.
--
-- To deploy on MySQL: open a MySQL shell as a privileged user and run
--     mysql -u root -p < schema.sql
-- This creates the talent_matching database, switches to it, and creates
-- all tables. Column names below match the JPA-generated schema so the
-- entities can be reused without naming-strategy overrides.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS talent_matching;
USE talent_matching;

-- ---------- users ----------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CANDIDATE', 'EMPLOYER') NOT NULL,
    -- Week 8 change - membership tier
    membership_status ENUM('BASIC', 'PREMIUM') NOT NULL DEFAULT 'BASIC',
    membership_expiry DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- candidate_profiles ----------
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    contact_number VARCHAR(20) NOT NULL,
    education VARCHAR(50) NOT NULL,
    major VARCHAR(255) NOT NULL,
    years_of_experience INT NOT NULL DEFAULT 0,
    skills VARCHAR(1000) NOT NULL,
    -- Week 8 change - profile enhancement fields
    work_experience VARCHAR(5000) NULL,
    preferred_working_mode VARCHAR(20) NULL,
    preferred_location VARCHAR(255) NULL,
    resume_text VARCHAR(5000),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------- employer_profiles ----------
CREATE TABLE IF NOT EXISTS employer_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------- job_postings ----------
CREATE TABLE IF NOT EXISTS job_postings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employer_id BIGINT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    required_education VARCHAR(50),
    required_skills VARCHAR(1000),
    years_of_experience INT NOT NULL DEFAULT 0,
    work_mode VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);
