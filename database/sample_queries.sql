USE talent_matching;

-- Get all job postings
SELECT * FROM job_postings;

-- Get all candidates
SELECT * FROM candidate_profiles;

-- Search jobs by keyword in description
SELECT * FROM job_postings 
WHERE description LIKE '%Java%';

-- Filter candidates by skill
SELECT * FROM candidate_profiles 
WHERE skills LIKE '%Java%';

-- Filter candidates by education
SELECT * FROM candidate_profiles 
WHERE education = 'Bachelor';

-- Filter candidates by experience
SELECT * FROM candidate_profiles 
WHERE years_experience >= 2;

-- Get top 10 recommended jobs for a candidate (basic matching)
SELECT j.*, 
       (CASE WHEN j.required_skills LIKE '%Java%' THEN 1 ELSE 0 END +
        CASE WHEN j.required_education = 'Bachelor' THEN 1 ELSE 0 END +
        CASE WHEN j.years_experience <= 2 THEN 1 ELSE 0 END) AS match_score
FROM job_postings j
ORDER BY match_score DESC
LIMIT 10;

-- Get top 10 recommended candidates for a job (basic matching)
SELECT c.*,
       (CASE WHEN c.skills LIKE '%Java%' THEN 1 ELSE 0 END +
        CASE WHEN c.education = 'Bachelor' THEN 1 ELSE 0 END +
        CASE WHEN c.years_experience >= 2 THEN 1 ELSE 0 END) AS match_score
FROM candidate_profiles c
ORDER BY match_score DESC
LIMIT 10;

-- Get all jobs posted by a specific employer
SELECT * FROM job_postings 
WHERE employer_id = 1;

-- Get candidate profile by user id
SELECT * FROM candidate_profiles 
WHERE user_id = 1;