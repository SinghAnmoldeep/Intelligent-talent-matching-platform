// =============================================
// employer.js — Employer Dashboard
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  loadEmployerDashboard();
});

function loadEmployerDashboard() {
  const companyName =
    localStorage.getItem('companyName') ||
    sessionStorage.getItem('companyName') ||
    'TechCorp';

  const companyNameEl = document.getElementById('company-name');
  if (companyNameEl) {
    companyNameEl.textContent = companyName;
  }

  // Static dashboard values for now
  setText('stat-jobs', '8');
  setText('stat-applicants', '156');
  setText('stat-interviews', '12');
  setText('stat-recommended', '10');
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

let jobSkills = [];

function addSkill() {
  const input = document.getElementById('skillInput');
  if (!input) return;

  const value = input.value.trim();
  if (!value) return;

  const newSkills = value.split(/[,;]+/).map(s => s.trim()).filter(Boolean);

  newSkills.forEach(skill => {
    if (!jobSkills.includes(skill)) {
      jobSkills.push(skill);
    }
  });

  input.value = '';
  renderJobSkills();
}

function renderJobSkills() {
  const container = document.getElementById('skillsTags');
  if (!container) return;

  container.innerHTML = jobSkills.map((skill, index) => `
    <span class="skill-pill">
      ${escHtml(skill)}
      <button type="button" onclick="removeJobSkill(${index})">×</button>
    </span>
  `).join('');
}

function removeJobSkill(index) {
  jobSkills.splice(index, 1);
  renderJobSkills();
}

async function submitJob() {
  const token = getToken();

  const payload = {
    jobTitle: getVal('jobTitle'),
    companyName: getVal('companyName'),
    location: getVal('location'),
    workMode: getVal('workMode'),
    salaryRange: getVal('salaryRange'),
    yearsOfExperience: parseInt(getVal('yearsOfExperience')) || 0,
    description: getVal('description'),
    requiredEducation: getVal('requiredEducation'),
    requiredSkills: jobSkills.join(', ')
  };

  if (!payload.jobTitle || !payload.companyName || !payload.description) {
    showToast('Please fill in job title, company name, and description.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast('Job posted successfully!', 'success');

      setTimeout(() => {
        window.location.href = 'employer-dashboard.html';
      }, 1200);
    } else {
      const msg = await res.text();
      showToast(msg || 'Failed to post job.', 'error');
    }
  } catch (err) {
    showToast('Could not connect to backend.', 'error');
  }
}
