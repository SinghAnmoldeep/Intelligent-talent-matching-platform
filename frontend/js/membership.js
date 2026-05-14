// =============================================
// membership.js
// Membership Badge + Upgrade/Cancel UI
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  loadMembershipStatus();

  const upgradeBtn = document.getElementById('membership-upgrade-btn');
  const cancelBtn = document.getElementById('membership-cancel-btn');

  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', upgradeMembership);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelMembership);
  }
});

async function loadMembershipStatus() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    renderMembership('BASIC');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/membership/status`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });

    if (!res.ok) {
      renderMembership(localStorage.getItem('membership') || 'BASIC');
      return;
    }

    const data = await res.json();

    localStorage.setItem('membership', data.membershipStatus || 'BASIC');
    renderMembership(data.membershipStatus, data.membershipExpiry);

  } catch (err) {
    renderMembership(localStorage.getItem('membership') || 'BASIC');
  }
}

async function upgradeMembership() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    alert('Please login first.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/membership/upgrade`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Upgrade failed.');
      return;
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    localStorage.setItem('membership', data.membershipStatus || 'PREMIUM');

    renderMembership(data.membershipStatus || 'PREMIUM', data.membershipExpiry);
    alert(data.message || 'Upgraded to Premium!');

  } catch (err) {
    alert('Could not connect to membership service.');
  }
}

async function cancelMembership() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    alert('Please login first.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/membership/cancel`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Cancel failed.');
      return;
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    localStorage.setItem('membership', data.membershipStatus || 'BASIC');

    renderMembership(data.membershipStatus || 'BASIC', data.membershipExpiry);
    alert(data.message || 'Membership cancelled.');

  } catch (err) {
    alert('Could not connect to membership service.');
  }
}

function renderMembership(status, expiry) {
  const badge = document.getElementById('membership-badge');
  const upgradeBtn = document.getElementById('membership-upgrade-btn');
  const cancelBtn = document.getElementById('membership-cancel-btn');

  if (!badge || !upgradeBtn || !cancelBtn) return;

  const membershipStatus = (status || 'BASIC').toUpperCase();

  if (membershipStatus === 'PREMIUM') {
    badge.textContent = expiry
      ? `⭐ PREMIUM until ${formatMembershipDate(expiry)}`
      : '⭐ PREMIUM';

    badge.className = 'membership-badge premium';

    upgradeBtn.classList.add('hidden');
    cancelBtn.classList.remove('hidden');
  } else {
    badge.textContent = 'BASIC';
    badge.className = 'membership-badge basic';

    upgradeBtn.classList.remove('hidden');
    cancelBtn.classList.add('hidden');
  }
}

function formatMembershipDate(dateStr) {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}