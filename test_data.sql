USE talent_matching;

INSERT INTO users (email, password, role) VALUES
('alice@test.com',    'hashed_pw_1', 'candidate'),
('bob@test.com',      'hashed_pw_2', 'candidate'),
('carol@test.com',    'hashed_pw_3', 'candidate'),
('david@test.com',    'hashed_pw_4', 'candidate'),
('emma@test.com',     'hashed_pw_5', 'candidate'),
('techcorp@test.com', 'hashed_pw_6', 'employer'),
('startupx@test.com', 'hashed_pw_7', 'employer'),
('bigbank@test.com',  'hashed_pw_8', 'employer');

INSERT INTO candidate_profiles (user_id, full_name, phone, education, major, years_experience, skills) VALUES
(1, 'Alice Smith', '0411000001', 'Bachelor', 'Computer Science',    2, 'Java,Spring Boot,MySQL'),
(2, 'Bob Johnson', '0411000002', 'Master',   'Software Engineering',4, 'Python,Django,PostgreSQL'),
(3, 'Carol White', '0411000003', 'Bachelor', 'Information Systems', 1, 'HTML,CSS,JavaScript,React'),
(4, 'David Brown', '0411000004', 'PhD',      'Data Science',        6, 'Python,Machine Learning,SQL'),
(5, 'Emma Davis',  '0411000005', 'Bachelor', 'Computer Science',    3, 'Java,REST APIs,Spring Boot,MySQL');

INSERT INTO employer_profiles (user_id, company_name, contact_email, industry) VALUES
(6, 'TechCorp', 'hr@techcorp.com', 'Software'),
(7, 'StartupX', 'hr@startupx.com', 'Fintech'),
(8, 'Big Bank',  'hr@bigbank.com', 'Banking');

INSERT INTO job_postings (employer_id, job_title, company_name, description, required_education, required_skills, years_experience, work_mode, location) VALUES
(6, 'Java Backend Developer', 'TechCorp', 'Build REST APIs using Spring Boot', 'Bachelor', 'Java,Spring Boot,MySQL', 2, 'Remote', 'Sydney'),
(6, 'Full Stack Developer',   'TechCorp', 'Frontend and backend web development', 'Bachelor', 'Java,React,MySQL', 1, 'Hybrid', 'Sydney'),
(7, 'Frontend Developer',     'StartupX', 'Build React UI for fintech app', 'Bachelor', 'React,JavaScript,CSS', 1, 'Remote', 'Melbourne'),
(7, 'Data Analyst',           'StartupX', 'Analyse customer transaction data', 'Master', 'Python,SQL,Excel', 3, 'Onsite', 'Melbourne'),
(8, 'Database Administrator', 'Big Bank', 'Manage and optimise bank databases', 'Bachelor', 'MySQL,PostgreSQL,SQL', 4, 'Onsite', 'Brisbane'),
(8, 'ML Engineer',            'Big Bank', 'Build machine learning pipelines', 'Master', 'Python,Machine Learning,SQL', 3, 'Hybrid', 'Sydney');
