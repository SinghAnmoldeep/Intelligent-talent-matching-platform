// =============================================
// profile.js
// Candidate Profile Page
// =============================================

let skills = [];

// ---- On load ----
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  setupSkillInput();
  setupResumeDropzone();
});

// ---- Fetch existing profile from backend ----
async function loadProfile() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE_URL}/candidate/profile`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!res.ok) return; // no profile yet — form stays blank

    const data = await res.json();

    // Personal info
    setVal('fullName',    data.user?.fullName || '');
    setVal('email',       data.user?.email    || localStorage.getItem('userEmail') || '');
    setVal('phone',       data.contactNumber  || '');
    setVal('location',    data.preferredLocation || '');

    // Professional info
    setVal('education',   data.education      || '');
    setVal('major',       data.major          || '');
    setVal('experience',  data.yearsOfExperience ?? '');
    setVal('workExperience', data.workExperience || '');
    setVal('workMode',    data.preferredWorkMode || '');
    setVal('summary',     data.resumeText     || '');

    // Skills
    if (data.skills) {
      skills = data.skills.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
      renderSkills();
    }

  } catch (e) {
    // Backend offline — demo prefill
    setVal('fullName', 'John Doe');
    setVal('email', 'john.doe@email.com');
    setVal('phone', '+61 400 000 000');
    setVal('location', 'Sydney, NSW');
    setVal('education', 'Bachelor');
    setVal('major', 'Computer Science - University of Sydney');
    setVal('experience', '5');
    setVal('workExperience', 'Worked on frontend and backend projects, including dashboard pages, profile forms, and API integration.');
    setVal('workMode', 'Hybrid');
    setVal('summary', 'Passionate developer with extensive experience in modern web technologies.');
    skills = ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'];
    renderSkills();
  }
}

// ---- Save profile ----
async function saveProfile() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const payload = {
    contactNumber:      getVal('phone'),
    education:          getVal('education'),
    major:              getVal('major'),
    yearsOfExperience:  parseInt(getVal('experience')) || 0,
    skills:             skills.join(', '),
    workExperience:     getVal('workExperience'),
    preferredLocation:  getVal('location'),
    preferredWorkMode:  getVal('workMode'),
    resumeText:         getVal('summary')
  };

  if (!token) {
    showToast('Saved locally (not connected to backend)', 'success');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/candidate/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast('Profile saved successfully!', 'success');
      // Update stored name
      const name = getVal('fullName');
      if (name) {
        localStorage.setItem('userName', name);
        sessionStorage.setItem('userName', name);
      }
    } else {
      const msg = await res.text();
      showToast(msg || 'Failed to save profile', 'error');
    }
  } catch (e) {
    showToast('Could not reach server. Check backend is running.', 'error');
  }
}

// ---- Skills ----
function setupSkillInput() {
  const input = document.getElementById('skillInput');

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  });
}

function addSkill() {
  const input = document.getElementById('skillInput');
  const val = input.value.trim();
  if (!val) return;

  // Split by comma in case user types multiple at once
  const newSkills = val.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
  newSkills.forEach(s => {
    if (s && !skills.includes(s)) skills.push(s);
  });

  input.value = '';
  renderSkills();
}

function removeSkill(index) {
  skills.splice(index, 1);
  renderSkills();
}

function renderSkills() {
  const container = document.getElementById('skillsTags');
  container.innerHTML = '';

  skills.forEach((skill, i) => {
    const pill = document.createElement('span');
    pill.className = 'skill-pill';
    pill.innerHTML = `
      ${escHtml(skill)}
      <button type="button" onclick="removeSkill(${i})" title="Remove skill">×</button>
    `;
    container.appendChild(pill);
  });
}

// ---- Resume dropzone ----
function setupResumeDropzone() {
  const zone = document.getElementById('resumeDropzone');
  const input = document.getElementById('resumeInput');

  zone.addEventListener('click', () => input.click());

  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('dragover');
  });

  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));

  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  input.addEventListener('change', () => {
    if (input.files[0]) handleFile(input.files[0]);
  });
}

function handleFile(file) {
  const allowed = ['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (!allowed.includes(file.type)) {
    showToast('Please upload a PDF or DOC/DOCX file', 'error');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showToast('File must be under 10MB', 'error');
    return;
  }

  document.getElementById('resumeFileName').textContent = '📎 ' + file.name;
  showToast('Resume selected: ' + file.name, 'success');
}

function handleCancel() {
  if (confirm('Discard unsaved changes?')) {
    window.location.href = 'candidate-dashboard.html';
  }
}

