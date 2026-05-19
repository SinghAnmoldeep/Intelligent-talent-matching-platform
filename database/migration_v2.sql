-- ============================================================
-- Migration v2 - Week 8 Requirement Change (CSIT314 2nd Submission)
-- Apply this on top of schema.sql for an existing v1 database.
-- For fresh installs the new columns are already in schema.sql.
--
-- This migration is IDEMPOTENT. Every ADD COLUMN uses IF NOT EXISTS
-- (MySQL 8.0.29+ syntax) so running the file more than once is safe
-- and will NOT fail with "Duplicate column" errors.
--
-- Type alignment note: preferred_working_mode is declared as VARCHAR(20)
-- here to match schema.sql and the CandidateProfile JPA entity
-- (private String preferredWorkMode). The previous ENUM declaration
-- was inconsistent with the entity and the canonical schema, so it has
-- been unified to VARCHAR(20).
-- ============================================================
USE talent_matching;

-- A. Candidate Profile Enhancement
--    Adds work_experience + preferred_working_mode + preferred_location
--    so the matching algorithm can use them.
ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS work_experience          TEXT NULL                AFTER skills,
  ADD COLUMN IF NOT EXISTS preferred_working_mode   VARCHAR(20) NULL         AFTER work_experience,
  ADD COLUMN IF NOT EXISTS preferred_location       VARCHAR(255) NULL        AFTER preferred_working_mode;

-- B. Membership feature (BASIC default, PREMIUM for paid members).
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS membership_status   ENUM('BASIC','PREMIUM') NOT NULL DEFAULT 'BASIC',
  ADD COLUMN IF NOT EXISTS membership_expiry   DATE NULL;

-- ============================================================
-- Rollback (run this to undo the migration if needed)
-- ============================================================
-- ALTER TABLE candidate_profiles
--   DROP COLUMN preferred_location,
--   DROP COLUMN preferred_working_mode,
--   DROP COLUMN work_experience;
--
-- ALTER TABLE users
--   DROP COLUMN membership_expiry,
--   DROP COLUMN membership_status;
