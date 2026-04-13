let selectedRole = null;

function selectRole(role) {
  selectedRole = role;

  document.querySelectorAll('.role-card').forEach(c => {
    c.classList.remove('selected');
  });

  document.getElementById('card-' + role).classList.add('selected');

  const btn = document.getElementById('btn-continue');
  btn.disabled = false;
  btn.textContent =
    role === 'candidate'
      ? 'Continue as Candidate'
      : 'Continue as Employer';
}

function handleContinue() {
  if (!selectedRole) return;

  sessionStorage.setItem('selectedRole', selectedRole);
  window.location.href = 'pages/login.html';
}
