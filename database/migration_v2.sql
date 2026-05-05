USE talent_matching;

-- A: Candidate Profile Enhancement
ALTER TABLE candidate_profiles
ADD COLUMN work_experience TEXT,
ADD COLUMN preferred_working_mode ENUM('REMOTE', 'ONSITE', 'HYBRID'),
ADD COLUMN preferred_location VARCHAR(255);

-- B: Membership Feature
ALTER TABLE users
ADD COLUMN membership_status ENUM('MEMBER', 'NON_MEMBER') DEFAULT 'NON_MEMBER';