🔹 Intelligent Talent Matching Platform

This project is a web-based recruitment system designed to improve the efficiency of job searching and talent acquisition.

The platform supports two types of users:

Candidates – who can create profiles, search for jobs, and receive personalized job recommendations
Employers – who can post job opportunities, search for candidates, and receive recommended candidate matches
🚀 Key Features
👤 Candidate Side
User registration and login
Profile creation (education, skills, experience)
Browse and search job postings
Top-10 recommended jobs based on profile matching
🏢 Employer Side
User registration and login
Create and manage job postings
Search and filter candidate profiles
Top-10 recommended candidates based on job requirements
🧠 Intelligent Matching

The system uses a rule-based recommendation mechanism that evaluates:

Skill matching
Education and major
Years of experience
Job requirements

Based on these factors, the platform ranks results and provides the most relevant matches.

🛠️ Tech Stack
Backend: Java (Spring Boot)
Frontend: HTML, CSS, JavaScript (or React)
Database: MySQL
Tools: GitHub, Postman
🎯 Objective

To simulate a real-world recruitment platform while applying software engineering principles, including:

System design
Modular development
Full-stack integration
📌 Project Status

🚧 Under Development

👥 Team

Anmoldeep Singh (Project Manager, Lead Developer, Backend Developer)
Noor Ahmed (Frontend Developer)
Muhammad Saaim (Backend Developer)
Avantika Ragesh (Database + Integration)
Duaa Iqbal (Documentation, Helping In Frontend)

⚙️ How to Run
Clone the repository
git clone https://github.com/your-username/intelligent-talent-matching-platform.git
cd intelligent-talent-matching-platform

Setup MySQL Database
Create a new database (e.g. talent_db)
Import schema.sql (if available)
Configure application.properties

Update database credentials:
spring.datasource.url=jdbc:mysql://localhost:3306/talent_db
spring.datasource.username=your_username
spring.datasource.password=your_password

Run Backend (Spring Boot)
mvn spring-boot:run

Run Frontend
Open the frontend folder
Run using Live Server or open index.html in browser

✅ Expected Result
Application runs locally
Users can register/login
Candidates & Employers can interact with the system
