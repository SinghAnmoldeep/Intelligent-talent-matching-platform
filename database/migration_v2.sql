USE talent_matching;

-- A. Candidate Profile Enhancement
--    Adds work_experience + preferred_working_mode + preferred_location
--    so the matching algorithm can use them.
ALTER TABLE candidate_profiles
  ADD COLUMN work_experience          TEXT NULL                             AFTER skills,
  ADD COLUMN preferred_working_mode   ENUM('REMOTE','ONSITE','HYBRID') NULL AFTER work_experience,
  ADD COLUMN preferred_location       VARCHAR(255) NULL                     AFTER preferred_working_mode;

-- B. Membership feature (BASIC default, PREMIUM for paid members).
ALTER TABLE users
  ADD COLUMN membership_status   ENUM('BASIC','PREMIUM') NOT NULL DEFAULT 'BASIC',
  ADD COLUMN membership_expiry   DATE NULL;

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