USE talent_matching;

-- A: Candidate Profile Enhancement
ALTER TABLE candidate_profiles
ADD COLUMN work_experience TEXT NULL AFTER skills,
ADD COLUMN preferred_working_mode ENUM('REMOTE', 'ONSITE', 'HYBRID') NULL,
ADD COLUMN preferred_location VARCHAR(255) NULL;

-- B: Membership Feature
ALTER TABLE users
MODIFY COLUMN membership_status ENUM('BASIC', 'PREMIUM') NOT NULL DEFAULT 'BASIC',
ADD COLUMN membership_expiry DATE NULL;