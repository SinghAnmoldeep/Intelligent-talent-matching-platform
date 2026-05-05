CREATE DATABASE IF NOT EXISTS talent_matching;
USE talent_matching;

-- Candidates: Alice + Carol are PREMIUM members (used to demo unlimited recommendations).
-- Bob, David, Emma stay BASIC. TechCorp employer is PREMIUM, others BASIC.
INSERT INTO users (email, password, role, membership_status, membership_expiry) VALUES
('alice@test.com',    'hashed_pw_1', 'CANDIDATE', 'PREMIUM', DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)),
('bob@test.com',      'hashed_pw_2', 'CANDIDATE', 'BASIC',   NULL),
('carol@test.com',    'hashed_pw_3', 'CANDIDATE', 'PREMIUM', DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)),
('david@test.com',    'hashed_pw_4', 'CANDIDATE', 'BASIC',   NULL),
('emma@test.com',     'hashed_pw_5', 'CANDIDATE', 'BASIC',   NULL),
('techcorp@test.com', 'hashed_pw_6', 'EMPLOYER',  'PREMIUM', DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)),
('startupx@test.com', 'hashed_pw_7', 'EMPLOYER',  'BASIC',   NULL),
('bigbank@test.com',  'hashed_pw_8', 'EMPLOYER',  'BASIC',   NULL);

-- Candidate profiles populated with the new Week 8 fields:
-- work_experience, preferred_working_mode, preferred_location.
INSERT INTO candidate_profiles
  (user_id, full_name, phone, education, major, years_experience, skills,
   work_experience, preferred_working_mode, preferred_location)
VALUES
(1, 'Alice Smith', '0411000001', 'Bachelor', 'Computer Science',     2,
 'Java,Spring Boot,MySQL',
 '2y at FinTechCo as Junior Backend Engineer building Spring Boot APIs.',
 'REMOTE',  'Sydney'),
(2, 'Bob Johnson', '0411000002', 'Master',   'Software Engineering', 4,
 'Python,Django,PostgreSQL',
 '4y across two startups - led the migration of a legacy Django monolith to microservices.',
 'HYBRID',  'Melbourne'),
(3, 'Carol White', '0411000003', 'Bachelor', 'Information Systems',  1,
 'HTML,CSS,JavaScript,React',
 '1y as Junior Frontend Developer at a digital agency. Shipped 4 React dashboards.',
 'REMOTE',  'Brisbane'),
(4, 'David Brown', '0411000004', 'PhD',      'Data Science',         6,
 'Python,Machine Learning,SQL',
 '6y in ML research, recently built a recommendation engine serving 100k+ DAU.',
 'ONSITE',  'Sydney'),
(5, 'Emma Davis',  '0411000005', 'Bachelor', 'Computer Science',     3,
 'Java,REST APIs,Spring Boot,MySQL',
 '3y building Spring Boot REST APIs for a banking SaaS platform.',
 'HYBRID',  'Sydney');

INSERT INTO employer_profiles (user_id, company_name, contact_email, industry) VALUES
(6, 'TechCorp', 'hr@techcorp.com', 'Software'),
(7, 'StartupX', 'hr@startupx.com', 'Fintech'),
(8, 'Big Bank', 'hr@bigbank.com',  'Banking');

INSERT INTO job_postings (employer_id, job_title, company_name, description, required_education, required_skills, years_experience, work_mode, location) VALUES
(6, 'Java Backend Developer', 'TechCorp', 'Build REST APIs using Spring Boot',     'Bachelor', 'Java,Spring Boot,MySQL',     2, 'Remote', 'Sydney'),
(6, 'Full Stack Developer',   'TechCorp', 'Frontend and backend web development', 'Bachelor', 'Java,React,MySQL',           1, 'Hybrid', 'Sydney'),
(7, 'Frontend Developer',     'StartupX', 'Build React UI for fintech app',       'Bachelor', 'React,JavaScript,CSS',       1, 'Remote', 'Melbourne'),
(7, 'Data Analyst',           'StartupX', 'Analyse customer transaction data',    'Master',   'Python,SQL,Excel',           3, 'Onsite', 'Melbourne'),
(8, 'Database Administrator', 'Big Bank', 'Manage and optimise bank databases',   'Bachelor', 'MySQL,PostgreSQL,SQL',       4, 'Onsite', 'Brisbane'),
(8, 'ML Engineer',            'Big Bank', 'Build machine learning pipelines',     'Master',   'Python,Machine Learning,SQL', 3, 'Hybrid', 'Sydney');
