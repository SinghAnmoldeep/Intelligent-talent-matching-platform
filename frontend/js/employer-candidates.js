// =============================================
// candidates.js — Employer Candidate Browser
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

document.addEventListener('DOMContentLoaded', () => {
  renderCandidates(CANDIDATES);
  setupCandidateSearch();

  if (new URLSearchParams(window.location.search).has('search')) {
    document.getElementById('candidate-search-input').focus();
  }
});

function setupCandidateSearch() {
  const input = document.getElementById('candidate-search-input');
  const button = document.getElementById('candidate-search-btn');
  const filter = document.getElementById('experience-filter');

  input.addEventListener('input', filterCandidates);
  button.addEventListener('click', filterCandidates);
  filter.addEventListener('change', filterCandidates);
}

function filterCandidates() {
  const query = document.getElementById('candidate-search-input').value.toLowerCase().trim();
  const expFilter = document.getElementById('experience-filter').value;

  let filtered = CANDIDATES.filter(candidate => {
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

    return matchesQuery && matchesExperience;
  });

  renderCandidates(filtered);
}

function renderCandidates(candidates) {
  const grid = document.getElementById('candidate-grid');
  const count = document.getElementById('candidate-count');

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
        ${candidate.skills.map(skill => `<span class="candidate-skill">${escapeHtml(skill)}</span>`).join('')}
      </div>

      <div class="candidate-info-grid">
        <div class="candidate-info-item">📍 ${escapeHtml(candidate.location)}</div>
        <div class="candidate-info-item">💼 ${candidate.experience} years experience</div>
        <div class="candidate-info-item">✉️ ${escapeHtml(candidate.email)}</div>
        <div class="candidate-info-item">📞 ${escapeHtml(candidate.phone)}</div>
        <div class="candidate-info-item candidate-education">🎓 ${escapeHtml(candidate.education)}</div>
      </div>

      <div class="candidate-actions">
        <button class="btn-view-profile" onclick="openProfileModal(${candidate.id})">View Profile</button>
        <button class="btn-contact" onclick="contactCandidate(${candidate.id})">Contact</button>
      </div>
    </div>
  `).join('');
}

function viewProfile(candidateId) {
  alert(`Opening profile for candidate #${candidateId}`);
}

function openProfileModal(candidateId) {
  const candidate = CANDIDATES.find(c => c.id === candidateId);
  if (!candidate) return;

  // Fill modal
  setText('profile-name', candidate.name);
  setText('profile-title', candidate.title);
  setText('profile-summary', candidate.summary);
  setText('profile-location', candidate.location);
  setText('profile-exp', candidate.experience + ' years experience');
  setText('profile-email', candidate.email);
  setText('profile-phone', candidate.phone);
  setText('profile-education', candidate.education);

  // Skills
  const skillsEl = document.getElementById('profile-skills');
  skillsEl.innerHTML = candidate.skills
    .map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`)
    .join('');

  // Contact button
  document.getElementById('contact-btn').onclick = () => {
    window.location.href = `mailto:${candidate.email}`;
  };

  // Show modal
  document.getElementById('profile-modal').classList.add('open');
}

function closeProfileModal() {
  document.getElementById('profile-modal').classList.remove('open');
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function contactCandidate(candidateId) {
  const candidate = CANDIDATES.find(c => c.id === candidateId);
  if (!candidate) return;

  window.location.href = `mailto:${candidate.email}`;
}

function handleLogout(event) {
  event.preventDefault();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '../index.html';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}