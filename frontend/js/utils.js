// =============================================
// utils.js
// Shared utility functions for all pages
// =============================================

// Escape HTML to prevent XSS
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

// Get value from a form element by id
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// Set value on a form element by id
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

// Show a toast notification
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast ' + type;
  void toast.offsetWidth; // force reflow to restart animation
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// Get stored auth token
function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// Get stored user role
function getUserRole() {
  return localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
}

// Clear auth and redirect to landing page
function handleLogout(e) {
  if (e) e.preventDefault();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '../index.html';
}

// Redirect to correct dashboard based on stored role
function redirectToDashboard() {
  const role = getUserRole();
  if (role === 'EMPLOYER') {
    window.location.href = 'employer-dashboard.html';
  } else {
    window.location.href = 'candidate-dashboard.html';
  }
}

// Parse a comma/semicolon-separated skills string into an array
function parseSkills(str) {
  if (!str) return [];
  return str.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
}

// Format a date string for display
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}
