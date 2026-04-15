// =============================================
// employer.js
// Employer Dashboard & Create-Job Page Logic
// =============================================

// ---- Skill tags state (used on create-job page) ----
let jobSkills = [];

// ---- On load ----
document.addEventListener('DOMContentLoaded', () => {
  const page = getCurrentPage();

  if (page === 'employer-dashboard') {
    initDashboard();
  } else if (page === 'create-job') {
    initCreateJob();
  }
});

function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('employer-dashboard')) return 'employer-dashboard';
  if (path.includes('create-job')) return 'create-job';
  return '';
}

// =============================================
// DASHBOARD
// =============================================

async function initDashboard() {
  loadCompanyName();
  await Promise.all([loadDashboardStats(), loadMyJobs(), loadTopCandidates()]);
}

function loadCompanyName() {
  const name = localStorage.getItem('companyName') || sessionStorage.getItem('companyName') ||
               localStorage.getItem('userName') || sessionStorage.getItem('userName') || 'Your Company';
  const el = document.getElementById('company-name');
  if (el) el.textContent = name;
}

async function loadDashboardStats() {
  const token = getToken();

  // Static placeholders — replace with real endpoints when available
  document.getElementById('stat-applicants').textContent = '24';
  document.getElementById('stat-views').textContent = '130';

  if (!token) {
    document.getElementById('stat-jobs').textContent = '3';
    document.getElementById('stat-matched').textContent = '10';
    return;
  }

  try {
    const [jobsRes, candidatesRes] = await Promise.all([
      fetch(`${API_BASE_URL}/job`, { headers: { Authorization: 'Bearer ' + token } }),
      fetch(`${API_BASE_URL}/recommendations/candidates`, { headers: { Authorization: 'Bearer ' + token } })
    ]);

    if (jobsRes.ok) {
      const jobs = await jobsRes.json();
      document.getElementById('stat-jobs').textContent = jobs.length ?? '–';
    } else {
      document.getElementById('stat-jobs').textContent = '–';
    }

    if (candidatesRes.ok) {
      const candidates = await candidatesRes.json();
      document.getElementById('stat-matched').textContent = candidates.length ?? '–';
    } else {
      document.getElementById('stat-matched').textContent = '–';
    }
  } catch {
    document.getElementById('stat-jobs').textContent = '3';
    document.getElementById('stat-matched').textContent = '10';
  }
}

async function loadMyJobs() {
  const container = document.getElementById('jobs-list');
  if (!container) return;

  const token = getToken();
  const DEMO_JOBS = [
    { id: 1, jobTitle: 'Java Backend Developer', location: 'Sydney', workMode: 'Remote' },
    { id: 2, jobTitle: 'Full Stack Developer', location: 'Sydney', workMode: 'Hybrid' },
    { id: 3, jobTitle: 'Frontend Developer', location: 'Melbourne', workMode: 'Remote' }
  ];

  let jobs = DEMO_JOBS;

  if (token) {
    try {
      const res = await fetch(`${API_BASE_URL}/job`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) jobs = data;
      }
    } catch { /* fall through to demo data */ }
  }

  if (!jobs.length) {
    container.innerHTML = `
      <div class="activity-item">
        <p class="activity-title">No jobs posted yet. <a href="create-job.html">Post your first job</a></p>
      </div>`;
    return;
  }

  container.innerHTML = jobs.map(job => `
    <div class="activity-item">
      <div class="activity-icon activity-icon--blue">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="7" width="20" height="14" rx="2" stroke="#5046e5" stroke-width="2" fill="none"/>
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#5046e5" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div style="flex:1">
        <p class="activity-title">${escHtml(job.jobTitle || job.title || 'Untitled')}</p>
        <p class="activity-meta">${escHtml(job.location || '')}${job.workMode ? ' · ' + escHtml(job.workMode) : ''}</p>
      </div>
    </div>
  `).join('');
}

async function loadTopCandidates() {
  const container = document.getElementById('candidates-list');
  if (!container) return;

  const token = getToken();
  const DEMO_CANDIDATES = [
    { candidateName: 'Alice Smith', skills: 'Java, Spring Boot, MySQL', matchScore: 95 },
    { candidateName: 'Bob Johnson', skills: 'Python, Django, PostgreSQL', matchScore: 88 },
    { candidateName: 'Emma Davis', skills: 'Java, REST APIs, Spring Boot', matchScore: 82 }
  ];

  let candidates = DEMO_CANDIDATES;

  if (token) {
    try {
      const res = await fetch(`${API_BASE_URL}/recommendations/candidates`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) candidates = data;
      }
    } catch { /* fall through to demo data */ }
  }

  if (!candidates.length) {
    container.innerHTML = `
      <div class="activity-item">
        <p class="activity-title">No matched candidates yet. Post a job to start matching.</p>
      </div>`;
    return;
  }

  container.innerHTML = candidates.slice(0, 5).map(c => {
    const name  = escHtml(c.candidateName || c.fullName || 'Candidate');
    const score = c.matchScore || c.score || null;
    const skills = escHtml(c.skills || c.requiredSkills || '');
    return `
      <div class="activity-item">
        <div class="activity-icon activity-icon--green">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#059669" stroke-width="2" fill="none"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#059669" stroke-width="2" stroke-linecap="round" fill="none"/>
          </svg>
        </div>
        <div>
          <p class="activity-title">${name}${score ? ` <span style="color:#059669;font-size:0.8rem;">(${score}% match)</span>` : ''}</p>
          <p class="activity-meta">${skills}</p>
        </div>
      </div>`;
  }).join('');
}

// =============================================
// COMPANY PROFILE MODAL
// =============================================

function openProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (!modal) return;

  // Pre-fill from storage
  const company  = localStorage.getItem('companyName') || '';
  const email    = localStorage.getItem('userEmail') || '';
  const industry = localStorage.getItem('industry') || '';
  document.getElementById('profile-company').value  = company;
  document.getElementById('profile-email').value    = email;
  document.getElementById('profile-industry').value = industry;

  modal.showModal();
}

function closeProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (modal) modal.close();
}

async function saveCompanyProfile() {
  const token       = getToken();
  const companyName = document.getElementById('profile-company').value.trim();
  const contactEmail = document.getElementById('profile-email').value.trim();
  const industry    = document.getElementById('profile-industry').value.trim();

  // Save locally first
  if (companyName) {
    localStorage.setItem('companyName', companyName);
    const nameEl = document.getElementById('company-name');
    if (nameEl) nameEl.textContent = companyName;
  }
  if (industry) localStorage.setItem('industry', industry);

  if (!token) {
    showToast('Profile saved locally', 'success');
    closeProfileModal();
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/employer/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ companyName, contactEmail, industry })
    });

    if (res.ok) {
      showToast('Company profile saved!', 'success');
      closeProfileModal();
    } else {
      showToast('Failed to save profile', 'error');
    }
  } catch {
    showToast('Profile saved locally (server unreachable)', 'success');
    closeProfileModal();
  }
}

// =============================================
// CREATE JOB PAGE
// =============================================

function initCreateJob() {
  const skillInput = document.getElementById('skillInput');
  if (skillInput) {
    skillInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
    });
  }
}

function addSkill() {
  const input = document.getElementById('skillInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  val.split(/[,;]+/).map(s => s.trim()).filter(Boolean).forEach(s => {
    if (!jobSkills.includes(s)) jobSkills.push(s);
  });

  input.value = '';
  renderSkillTags();
}

function removeSkill(index) {
  jobSkills.splice(index, 1);
  renderSkillTags();
}

function renderSkillTags() {
  const container = document.getElementById('skillsTags');
  if (!container) return;
  container.innerHTML = jobSkills.map((skill, i) => `
    <span class="skill-pill">
      ${escHtml(skill)}
      <button type="button" onclick="removeSkill(${i})" aria-label="Remove ${escHtml(skill)}">×</button>
    </span>
  `).join('');
}

async function submitJob() {
  const token = getToken();

  const jobTitle   = document.getElementById('jobTitle')?.value.trim();
  const companyName = document.getElementById('companyName')?.value.trim();

  if (!jobTitle || !companyName) {
    showToast('Job title and company name are required', 'error');
    return;
  }

  const payload = {
    jobTitle,
    companyName,
    location:          document.getElementById('location')?.value.trim(),
    workMode:          document.getElementById('workMode')?.value,
    salaryRange:       document.getElementById('salaryRange')?.value.trim(),
    yearsOfExperience: parseInt(document.getElementById('yearsOfExperience')?.value) || 0,
    description:       document.getElementById('description')?.value.trim(),
    requiredEducation: document.getElementById('requiredEducation')?.value,
    requiredSkills:    jobSkills.join(', ')
  };

  if (!token) {
    showToast('Job posted! (demo mode — connect backend to persist)', 'success');
    setTimeout(() => { window.location.href = 'employer-dashboard.html'; }, 1800);
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast('Job posted successfully!', 'success');
      setTimeout(() => { window.location.href = 'employer-dashboard.html'; }, 1500);
    } else {
      const msg = await res.text();
      showToast(msg || 'Failed to post job', 'error');
    }
  } catch {
    showToast('Could not reach server. Check backend is running.', 'error');
  }
}

function handleCancel() {
  if (confirm('Discard this job post?')) {
    window.location.href = 'employer-dashboard.html';
  }
}

function handleLogout(e) {
  if (e) e.preventDefault();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '../index.html';
}
