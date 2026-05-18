-- =====================================================================
-- H2 in-memory seed data for the Talent Matching Platform (dev / demo).
-- This file lives on the Spring Boot classpath so it is picked up at
-- startup by spring.sql.init (mode=always + defer-datasource-init=true).
--
-- All passwords are the literal string "password" - the hash below is the
-- BCrypt encoding of "password" (cost 10).
--
-- Column names match the JPA-generated schema (snake_case from entity
-- fields), not the legacy MySQL schema.sql. The canonical MySQL DDL in
-- ../../../../database/schema.sql is kept as reference for prod deploy.
-- =====================================================================

-- ---------- USERS ----------
INSERT INTO users (full_name, email, password, role, membership_status, membership_expiry) VALUES
('Alice Smith',  'alice@test.com',    '$2b$10$V48cvtNwNWCqyqSek9afYuJr8T86Q1MGfIOUObxsCXoyBxVgROWeW', 'CANDIDATE', 'PREMIUM', DATEADD('DAY', 30, CURRENT_DATE)),
('Bob Johnson',  'bob@test.com',      '$2b$10$V48cvtNwNWCqyqSek9afYuJr8T86Q1MGfIOUObxsCXoyBxVgROWeW', 'CANDIDATE', 'BASIC',   NULL),
('Carol White',  'carol@test.com',    '$2b$10$V48cvtNwNWCqyqSek9afYuJr8T86Q1MGfIOUObxsCXoyBxVgROWeW', 'CANDIDATE', 'PREMIUM', DATEADD('DAY', 30, CURRENT_DATE)),
('David Brown',  'david@test.com',    '$2b$10$V48cvtNwNWCqyqSek9afYuJr8T86Q1MGfIOUObxsCXoyBxVgROWeW', 'CANDIDATE', 'BASIC',   NULL),
('Emma Davis',   'emma@test.com',     '$2b$10$V48cvtNwNWCqyqSek9afYuJr8T86Q1MGfIOUObxsCXoyBxVgROWeW', 'CANDIDATE', 'BASIC',   NULL),
('TechCorp HR',  'techcorp@test.com', '$2b$10$V48cvtNwNWCqyqSek9afYuJr8T86Q1MGfIOUObxsCXoyBxVgROWeW', 'EMPLOYER',  'PREMIUM', DATEADD('DAY', 30, CURRENT_DATE)),
('StartupX HR',  'startupx@test.com', '$2b$10$V48cvtNwNWCqyqSek9afYuJr8T86Q1MGfIOUObxsCXoyBxVgROWeW', 'EMPLOYER',  'BASIC',   NULL),
('Big Bank HR',  'bigbank@test.com',  '$2b$10$V48cvtNwNWCqyqSek9afYuJr8T86Q1MGfIOUObxsCXoyBxVgROWeW', 'EMPLOYER',  'BASIC',   NULL);

-- ---------- CANDIDATE PROFILES ----------
-- Includes the Week 8 fields: work_experience, preferred_working_mode, preferred_location.
INSERT INTO candidate_profiles
  (user_id, contact_number, education, major, years_of_experience, skills,
   work_experience, preferred_working_mode, preferred_location)
VALUES
(1, '0411000001', 'Bachelor', 'Computer Science',     2,
 'Java,Spring Boot,MySQL',
 '2y at FinTechCo as Junior Backend Engineer building Spring Boot APIs.',
 'REMOTE', 'Sydney'),
(2, '0411000002', 'Master',   'Software Engineering', 4,
 'Python,Django,PostgreSQL',
 '4y across two startups - led migration of a legacy Django monolith to microservices.',
 'HYBRID', 'Melbourne'),
(3, '0411000003', 'Bachelor', 'Information Systems',  1,
 'HTML,CSS,JavaScript,React',
 '1y as Junior Frontend Developer at a digital agency. Shipped 4 React dashboards.',
 'REMOTE', 'Brisbane'),
(4, '0411000004', 'PhD',      'Data Science',         6,
 'Python,Machine Learning,SQL',
 '6y in ML research, recently built a recommendation engine serving 100k+ DAU.',
 'ONSITE', 'Sydney'),
(5, '0411000005', 'Bachelor', 'Computer Science',     3,
 'Java,REST APIs,Spring Boot,MySQL',
 '3y building Spring Boot REST APIs for a banking SaaS platform.',
 'HYBRID', 'Sydney');

-- ---------- EMPLOYER PROFILES ----------
INSERT INTO employer_profiles (user_id, company_name, contact_email, industry) VALUES
(6, 'TechCorp', 'hr@techcorp.com', 'Software'),
(7, 'StartupX', 'hr@startupx.com', 'Fintech'),
(8, 'Big Bank', 'hr@bigbank.com',  'Banking');

-- ---------- JOB POSTINGS ----------
INSERT INTO job_postings (employer_id, job_title, company_name, description, required_education, required_skills, years_of_experience, work_mode, location) VALUES
(6, 'Java Backend Developer', 'TechCorp', 'Build REST APIs using Spring Boot',     'Bachelor', 'Java,Spring Boot,MySQL',     2, 'Remote', 'Sydney'),
(6, 'Full Stack Developer',   'TechCorp', 'Frontend and backend web development', 'Bachelor', 'Java,React,MySQL',           1, 'Hybrid', 'Sydney'),
(7, 'Frontend Developer',     'StartupX', 'Build React UI for fintech app',       'Bachelor', 'React,JavaScript,CSS',       1, 'Remote', 'Melbourne'),
(7, 'Data Analyst',           'StartupX', 'Analyse customer transaction data',    'Master',   'Python,SQL,Excel',           3, 'Onsite', 'Melbourne'),
(8, 'Database Administrator', 'Big Bank', 'Manage and optimise bank databases',   'Bachelor', 'MySQL,PostgreSQL,SQL',       4, 'Onsite', 'Brisbane'),
(8, 'ML Engineer',            'Big Bank', 'Build machine learning pipelines',     'Master',   'Python,Machine Learning,SQL', 3, 'Hybrid', 'Sydney');
