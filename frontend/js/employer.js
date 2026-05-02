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