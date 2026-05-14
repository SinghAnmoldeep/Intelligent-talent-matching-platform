// =============================================
// employer-candidates.js — Employer Candidate Browser
// Backend search integration + fallback demo data
// =============================================

const CANDIDATES = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Senior Full Stack Developer',
    summary: 'Experienced full stack developer with a passion for building scalable web applications.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker'],
    location: 'Sydney, NSW',
    experience: 6,
    email: 'sarah.j@email.com',
    phone: '+61 400 123 456',
    education: 'Bachelor of Computer Science - UNSW'
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Frontend Developer',
    summary: 'Frontend specialist focused on creating beautiful and performant user interfaces.',
    skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'Tailwind', 'Next.js'],
    location: 'Melbourne, VIC',
    experience: 4,
    email: 'michael.chen@email.com',
    phone: '+61 400 234 567',
    education: 'Bachelor of Software Engineering - Monash University'
  },
  {
    id: 3,
    name: 'Emily Watson',
    title: 'Data Scientist',
    summary: 'Data scientist with strong experience in machine learning, analytics, and business intelligence.',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
    location: 'Brisbane, QLD',
    experience: 5,
    email: 'emily.w@email.com',
    phone: '+61 400 345 678',
    education: 'Master of Data Science - University of Queensland'
  },
  {
    id: 4,
    name: 'David Kim',
    title: 'DevOps Engineer',
    summary: 'Cloud and DevOps engineer experienced in automation, CI/CD, and infrastructure management.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    location: 'Perth, WA',
    experience: 7,
    email: 'david.kim@email.com',
    phone: '+61 400 456 789',
    education: 'Bachelor of Information Technology - Curtin University'
  },
  {
    id: 5,
    name: 'Olivia Brown',
    title: 'UI/UX Designer',
    summary: 'Creative designer focused on user research, product design, and accessible digital experiences.',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    location: 'Sydney, NSW',
    experience: 3,
    email: 'olivia.b@email.com',
    phone: '+61 400 567 890',
    education: 'Bachelor of Design - UTS'
  },
  {
    id: 6,
    name: 'James Miller',
    title: 'Backend Developer',
    summary: 'Backend developer skilled in APIs, databases, and reliable server-side systems.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST API', 'Microservices'],
    location: 'Adelaide, SA',
    experience: 4,
    email: 'james.m@email.com',
    phone: '+61 400 678 901',
    education: 'Bachelor of Computer Science - University of Adelaide'
  },
  {
    id: 7,
    name: 'Sophia Lee',
    title: 'Mobile Developer',
    summary: 'Mobile developer building smooth cross-platform apps for Android and iOS.',
    skills: ['React Native', 'Flutter', 'Firebase', 'Android', 'iOS'],
    location: 'Canberra, ACT',
    experience: 5,
    email: 'sophia.lee@email.com',
    phone: '+61 400 789 012',
    education: 'Bachelor of Software Engineering - ANU'
  },
  {
    id: 8,
    name: 'Daniel Wilson',
    title: 'Product Manager',
    summary: 'Product manager with experience in agile delivery, stakeholder management, and strategy.',
    skills: ['Agile', 'Product Strategy', 'Analytics', 'User Stories', 'Roadmapping'],
    location: 'Sydney, NSW',
    experience: 8,
    email: 'daniel.w@email.com',
    phone: '+61 400 890 123',
    education: 'MBA - University of Melbourne'
  },
  {
    id: 9,
    name: 'Ava Thompson',
    title: 'QA Engineer',
    summary: 'Quality assurance engineer focused on test automation and reliable product releases.',
    skills: ['Selenium', 'Cypress', 'Testing', 'JavaScript', 'Automation'],
    location: 'Hobart, TAS',
    experience: 2,
    email: 'ava.t@email.com',
    phone: '+61 400 901 234',
    education: 'Bachelor of IT - University of Tasmania'
  },
  {
    id: 10,
    name: 'Noah Anderson',
    title: 'Cloud Engineer',
    summary: 'Cloud engineer experienced in secure, scalable cloud platforms and deployment workflows.',
    skills: ['AWS', 'Azure', 'Docker', 'Linux', 'Networking'],
    location: 'Melbourne, VIC',
    experience: 6,
    email: 'noah.a@email.com',
    phone: '+61 400 012 345',
    education: 'Bachelor of Computer Engineering - RMIT'
  }
];

let currentCandidates = [...CANDIDATES];
let candidateSearchTimer;

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderCandidates(CANDIDATES);
  setupBackendCandidateSearch();

  if (new URLSearchParams(window.location.search).has('search')) {
    document.getElementById('candidate-search-input')?.focus();
  }
});

// Backend search setup
function setupBackendCandidateSearch() {
  const input = document.getElementById('candidate-search-input');
  const button = document.getElementById('candidate-search-btn');

  const oldExperienceFilter = document.getElementById('experience-filter');
  const skillsFilter = document.getElementById('skills-filter');
  const experienceFilterBackend = document.getElementById('experience-filter-backend');
  const preferredModeFilter = document.getElementById('preferred-mode-filter');
  const preferredLocationFilter = document.getElementById('preferred-location-filter');
  const fuzzyToggle = document.getElementById('fuzzy-toggle');

  if (!input || !button) return;

  input.addEventListener('input', () => {
    clearTimeout(candidateSearchTimer);
    candidateSearchTimer = setTimeout(searchCandidatesFromBackend, 300);
  });

  button.addEventListener('click', searchCandidatesFromBackend);

  [
    oldExperienceFilter,
    skillsFilter,
    experienceFilterBackend,
    preferredModeFilter,
    preferredLocationFilter,
    fuzzyToggle
  ].forEach(el => {
    if (el) {
      el.addEventListener('change', searchCandidatesFromBackend);
    }
  });
}

// Search candidates from backend
async function searchCandidatesFromBackend() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const q = document.getElementById('candidate-search-input')?.value || '';
  const oldExpFilter = document.getElementById('experience-filter')?.value || '';

  const skills = document.getElementById('skills-filter')?.value || '';
  const backendMinExperience = document.getElementById('experience-filter-backend')?.value || '';
  const preferredMode = document.getElementById('preferred-mode-filter')?.value || '';
  const preferredLocation = document.getElementById('preferred-location-filter')?.value || '';
  const fuzzy = document.getElementById('fuzzy-toggle')?.checked || false;

  const params = new URLSearchParams();

  if (q.trim()) params.append('q', q.trim());
  if (skills.trim()) params.append('skills', skills.trim());

  // Use new backend min experience filter first.
  // If it is empty, convert old dropdown ranges to minimum experience.
  if (backendMinExperience) {
    params.append('min_experience', backendMinExperience);
  } else if (oldExpFilter === '0-2') {
    params.append('min_experience', '0');
  } else if (oldExpFilter === '3-5') {
    params.append('min_experience', '3');
  } else if (oldExpFilter === '6+') {
    params.append('min_experience', '6');
  }

  if (preferredMode) params.append('preferred_mode', preferredMode);

  if (preferredLocation.trim()) {
    params.append('preferred_location', preferredLocation.trim());
  }

  params.append('fuzzy', fuzzy);
  params.append('page', 0);
  params.append('size', 20);

  try {
    const res = await fetch(`${API_BASE_URL}/search/candidates?${params.toString()}`, {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });

    if (!res.ok) throw new Error('Candidate search failed');

    const data = await res.json();
    const results = data.content || [];

    const mapped = results.map(item => mapSearchResultToCandidate(item));

    currentCandidates = mapped;
    renderCandidates(mapped);

  } catch (err) {
    console.error(err);

    // Fallback to old local filtering if backend is unavailable
    const filtered = filterCandidatesLocally();
    currentCandidates = filtered;
    renderCandidates(filtered);
  }
}

// Convert backend SearchResultResponse to candidate card shape
function mapSearchResultToCandidate(item) {
  const parsed = parseCandidateSummary(item.summary || '');

  return {
    id: item.id,
    name: item.title || 'Candidate',
    title: parsed.education || 'Candidate Profile',
    summary: item.summary || 'No summary available.',
    skills: parsed.skills,
    location: parsed.location || '—',
    experience: parsed.experience || '—',
    email: item.subtitle || '—',
    phone: '—',
    education: parsed.education || '—',
    score: item.score
  };
}

// Backend summary currently looks like:
// "Bachelor | 3 years | React, Java"
function parseCandidateSummary(summary) {
  const parts = summary.split('|').map(p => p.trim());

  const education = parts[0] || '';
  const experienceText = parts[1] || '';
  const skillsText = parts[2] || '';

  const experienceNumber = parseInt(experienceText) || 0;
  const skills = skillsText
    ? skillsText.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return {
    education,
    experience: experienceNumber,
    skills,
    location: ''
  };
}

// Local fallback filtering
function filterCandidatesLocally() {
  const query = document.getElementById('candidate-search-input')?.value.toLowerCase().trim() || '';
  const expFilter = document.getElementById('experience-filter')?.value || 'all';
  const skillsFilter = document.getElementById('skills-filter')?.value.toLowerCase().trim() || '';

  return CANDIDATES.filter(candidate => {
    const searchableText = [
      candidate.name,
      candidate.title,
      candidate.summary,
      candidate.location,
      candidate.education,
      candidate.skills.join(' ')
    ].join(' ').toLowerCase();

    const matchesQuery = !query || searchableText.includes(query);

    let matchesExperience = true;

    if (expFilter === '0-2') {
      matchesExperience = candidate.experience <= 2;
    } else if (expFilter === '3-5') {
      matchesExperience = candidate.experience >= 3 && candidate.experience <= 5;
    } else if (expFilter === '6+') {
      matchesExperience = candidate.experience >= 6;
    }

    const matchesSkills =
      !skillsFilter ||
      candidate.skills.some(skill => skill.toLowerCase().includes(skillsFilter));

    return matchesQuery && matchesExperience && matchesSkills;
  });
}

// Render candidate cards
function renderCandidates(candidates) {
  const grid = document.getElementById('candidate-grid');
  const count = document.getElementById('candidate-count');

  if (!grid || !count) return;

  count.textContent = `Showing ${candidates.length} candidate${candidates.length !== 1 ? 's' : ''}`;

  if (candidates.length === 0) {
    grid.innerHTML = `<div class="no-candidates">No candidates found matching your search.</div>`;
    return;
  }

  grid.innerHTML = candidates.map(candidate => `
    <div class="candidate-card">
      <div class="candidate-top">
        <div class="candidate-avatar">♙</div>
        <div>
          <p class="candidate-name">${escapeHtml(candidate.name)}</p>
          <p class="candidate-title">${escapeHtml(candidate.title)}</p>
        </div>
      </div>

      <p class="candidate-summary">${escapeHtml(candidate.summary)}</p>

      <div class="candidate-skills">
        ${(candidate.skills || []).map(skill => `<span class="candidate-skill">${escapeHtml(skill)}</span>`).join('')}
      </div>

      <div class="candidate-info-grid">
        <div class="candidate-info-item">📍 ${escapeHtml(candidate.location || '—')}</div>
        <div class="candidate-info-item">💼 ${escapeHtml(String(candidate.experience || '—'))} years experience</div>
        <div class="candidate-info-item">✉️ ${escapeHtml(candidate.email || '—')}</div>
        <div class="candidate-info-item">📞 ${escapeHtml(candidate.phone || '—')}</div>
        <div class="candidate-info-item candidate-education">🎓 ${escapeHtml(candidate.education || '—')}</div>
      </div>

      <div class="candidate-actions">
        <button class="btn-view-profile" onclick="openProfileModal(${candidate.id})">View Profile</button>
        <button class="btn-contact" onclick="contactCandidate(${candidate.id})">Contact</button>
      </div>
    </div>
  `).join('');
}

// Modal
function openProfileModal(candidateId) {
  const candidate =
    currentCandidates.find(c => c.id === candidateId) ||
    CANDIDATES.find(c => c.id === candidateId);

  if (!candidate) return;

  setText('profile-name', candidate.name);
  setText('profile-title', candidate.title);
  setText('profile-summary', candidate.summary);
  setText('profile-location', candidate.location || '—');
  setText('profile-exp', `${candidate.experience || '—'} years experience`);
  setText('profile-email', candidate.email || '—');
  setText('profile-phone', candidate.phone || '—');
  setText('profile-education', candidate.education || '—');

  const skillsEl = document.getElementById('profile-skills');
  skillsEl.innerHTML = (candidate.skills || [])
    .map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`)
    .join('');

  document.getElementById('contact-btn').onclick = () => {
    if (candidate.email && candidate.email !== '—') {
      window.location.href = `mailto:${candidate.email}`;
    }
  };

  document.getElementById('profile-modal').classList.add('open');
}

function closeProfileModal() {
  document.getElementById('profile-modal').classList.remove('open');
}

function contactCandidate(candidateId) {
  const candidate =
    currentCandidates.find(c => c.id === candidateId) ||
    CANDIDATES.find(c => c.id === candidateId);

  if (!candidate || !candidate.email || candidate.email === '—') return;

  window.location.href = `mailto:${candidate.email}`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function handleLogout(event) {
  event.preventDefault();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '../index.html';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
