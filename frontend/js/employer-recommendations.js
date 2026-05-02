// =============================================
// Employer-recommendations.js
// Employer Recommended Candidates
// =============================================

const RECOMMENDED_CANDIDATES = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Senior Full Stack Developer',
    match: 94,
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
    match: 92,
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
    match: 90,
    summary: 'Data scientist with expertise in machine learning and predictive analytics.',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'R', 'Statistics'],
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
    match: 88,
    summary: 'DevOps engineer specializing in cloud infrastructure and automation.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Terraform'],
    location: 'Sydney, NSW',
    experience: 7,
    email: 'david.kim@email.com',
    phone: '+61 400 456 789',
    education: 'Bachelor of Information Technology - UTS'
  },
  {
    id: 5,
    name: 'Olivia Brown',
    title: 'UI/UX Designer',
    match: 86,
    summary: 'Creative designer with strong experience in research, prototyping, and design systems.',
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
    match: 84,
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
    match: 82,
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
    match: 80,
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
    match: 78,
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
    match: 76,
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
  renderRecommendedCandidates(RECOMMENDED_CANDIDATES);
});

function renderRecommendedCandidates(candidates) {
  const grid = document.getElementById('emp-rec-grid');
  const count = document.getElementById('emp-rec-count');

  count.textContent = `Showing top ${candidates.length} recommended candidates`;

  grid.innerHTML = candidates.map(candidate => `
    <div class="emp-candidate-card">
      <div class="emp-card-top">
        <div class="emp-candidate-left">
          <div class="emp-avatar">♙</div>
          <div>
            <p class="emp-candidate-name">${escapeHtml(candidate.name)}</p>
            <p class="emp-candidate-title">${escapeHtml(candidate.title)}</p>
          </div>
        </div>

        <div class="emp-match-badge">↗ ${candidate.match}% Match</div>
      </div>

      <p class="emp-summary">${escapeHtml(candidate.summary)}</p>

      <div class="emp-skills">
        ${candidate.skills.map(skill => `<span class="emp-skill">${escapeHtml(skill)}</span>`).join('')}
      </div>

      <div class="emp-info-grid">
        <div class="emp-info-item">📍 ${escapeHtml(candidate.location)}</div>
        <div class="emp-info-item">💼 ${candidate.experience} years experience</div>
        <div class="emp-info-item">✉️ ${escapeHtml(candidate.email)}</div>
        <div class="emp-info-item">📞 ${escapeHtml(candidate.phone)}</div>
        <div class="emp-info-item emp-education">🎓 ${escapeHtml(candidate.education)}</div>
      </div>

      <div class="emp-actions">
        <button class="emp-btn-view" onclick="openProfileModal(${candidate.id})">View Profile</button>
        <button class="emp-btn-contact" onclick="contactCandidate(${candidate.id})">Contact</button>
      </div>
    </div>
  `).join('');
}

function viewProfile(candidateId) {
  alert(`Opening profile for candidate #${candidateId}`);
}

function openProfileModal(candidateId) {
  const candidate = RECOMMENDED_CANDIDATES.find(c => c.id === candidateId);
  if (!candidate) return;

  setText('profile-name', candidate.name);
  setText('profile-title', candidate.title);
  setText('profile-summary', candidate.summary);
  setText('profile-location', candidate.location);
  setText('profile-exp', candidate.experience + ' years experience');
  setText('profile-email', candidate.email);
  setText('profile-phone', candidate.phone);
  setText('profile-education', candidate.education);

  const skillsEl = document.getElementById('profile-skills');
  skillsEl.innerHTML = candidate.skills
    .map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`)
    .join('');

  document.getElementById('contact-btn').onclick = () => {
    window.location.href = `mailto:${candidate.email}`;
  };

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
  const candidate = RECOMMENDED_CANDIDATES.find(c => c.id === candidateId);
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