// =============================================
// recommendations.js
// Candidate — Recommended Jobs Page
// =============================================

// Fallback demo data shown when backend is offline
const DEMO_JOBS = [
  {
    id: 1, jobTitle: 'Senior Full Stack Developer', companyName: 'TechCorp Inc.',
    requiredSkills: 'React, Node.js, TypeScript, AWS, MongoDB',
    location: 'Sydney, NSW', workMode: 'Full-time',
    yearsOfExperience: 5, score: 95,
    description: 'We are looking for an experienced full stack developer to join our growing team.'
  },
  {
    id: 2, jobTitle: 'Frontend Developer', companyName: 'Digital Solutions',
    requiredSkills: 'React, TypeScript, CSS, Tailwind, Next.js',
    location: 'Melbourne, VIC', workMode: 'Full-time',
    yearsOfExperience: 3, score: 92,
    description: 'Join our team to build beautiful and responsive web applications.'
  },
  {
    id: 3, jobTitle: 'Data Scientist', companyName: 'AI Innovations',
    requiredSkills: 'Python, Machine Learning, TensorFlow, SQL, Statistics',
    location: 'Brisbane, QLD', workMode: 'Full-time',
    yearsOfExperience: 4, score: 89,
    description: 'Work on cutting-edge AI projects and help shape the future of technology.'
  },
  {
    id: 4, jobTitle: 'UI/UX Designer', companyName: 'Creative Studio',
    requiredSkills: 'Figma, Adobe XD, User Research, Prototyping, Design Systems',
    location: 'Sydney, NSW', workMode: 'Contract',
    yearsOfExperience: 2, score: 86,
    description: 'Create beautiful and intuitive user experiences for our clients.'
  },
  {
    id: 5, jobTitle: 'DevOps Engineer', companyName: 'CloudTech',
    requiredSkills: 'Docker, Kubernetes, AWS, CI/CD, Terraform',
    location: 'Perth, WA', workMode: 'Full-time',
    yearsOfExperience: 5, score: 83,
    description: 'Manage and optimize our cloud infrastructure and deployment pipelines.'
  },
  {
    id: 6, jobTitle: 'Backend Developer', companyName: 'FinTech Solutions',
    requiredSkills: 'Node.js, Python, PostgreSQL, Redis, Microservices',
    location: 'Sydney, NSW', workMode: 'Full-time',
    yearsOfExperience: 3, score: 80,
    description: 'Build scalable backend systems for financial applications.'
  },
  {
    id: 7, jobTitle: 'Mobile Developer', companyName: 'AppWorks',
    requiredSkills: 'React Native, iOS, Android, TypeScript, Firebase',
    location: 'Melbourne, VIC', workMode: 'Full-time',
    yearsOfExperience: 4, score: 77,
    description: 'Develop cross-platform mobile applications for millions of users.'
  },
  {
    id: 8, jobTitle: 'Product Manager', companyName: 'StartupHub',
    requiredSkills: 'Product Strategy, Agile, User Stories, Analytics, Stakeholder Management',
    location: 'Sydney, NSW', workMode: 'Full-time',
    yearsOfExperience: 5, score: 74,
    description: 'Lead product development and strategy for our innovative platform.'
  }
];

// ---- Fetch recommendations from backend ----
async function loadRecommendations() {
  const container = document.getElementById('jobs-container');
  const countLabel = document.getElementById('rec-count-label');

  container.innerHTML = `<div class="rec-loading"><div class="spinner"></div> Loading recommendations...</div>`;

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    renderJobs(DEMO_JOBS, container, countLabel);
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/jobs`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!res.ok) throw new Error('API error');

    const data = await res.json();

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="rec-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#d1d5db" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>
          <p>No recommendations yet. Complete your profile to get personalized job matches.</p>
        </div>`;
      return;
    }

    renderJobs(data, container, countLabel);

  } catch (e) {
    // Backend offline — use demo data
    renderJobs(DEMO_JOBS, container, countLabel);
  }
}

// ---- Render job cards ----
function renderJobs(jobs, container, countLabel) {
  countLabel.textContent = `Showing top ${jobs.length} recommended jobs`;
  container.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'job-cards-grid';

  jobs.forEach(job => {
    const skills = parseSkills(job.requiredSkills || job.skills || '');
    const score  = job.score || job.matchScore || null;

    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
      <div class="job-card-header">
        <div>
          <p class="job-card-title">${escHtml(job.jobTitle || job.title || 'Job Title')}</p>
          <p class="job-card-company">${escHtml(job.companyName || 'Company')}</p>
        </div>
        ${score ? `
        <div class="match-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 6 23 6 23 12" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${score}% Match
        </div>` : ''}
      </div>

      <div class="skills-row">
        ${skills.map(s => `<span class="skill-tag">${escHtml(s)}</span>`).join('')}
      </div>

      <div class="job-meta-grid">
        <div class="job-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          ${escHtml(job.location || '—')}
        </div>
        <div class="job-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          ${escHtml(job.workMode || 'Full-time')}
        </div>
        ${job.salaryRange ? `
        <div class="job-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          ${escHtml(job.salaryRange)}
        </div>` : ''}
        <div class="job-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${job.yearsOfExperience ? job.yearsOfExperience + '+ years' : '—'}
        </div>
      </div>

      ${job.description ? `<p class="job-desc">${escHtml(job.description)}</p>` : ''}

      <button class="btn-apply" onclick="applyToJob(${job.id})">Apply Now</button>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

// ---- Apply handler (placeholder – wire to your application endpoint) ----
function applyToJob(jobId) {
  alert(`Application for Job #${jobId} submitted! (Connect to your backend endpoint)`);
}

// ---- Helpers ----
function parseSkills(str) {
  if (!str) return [];
  return str.split(/[,;]+/).map(s => s.trim()).filter(Boolean).slice(0, 6);
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', loadRecommendations);
