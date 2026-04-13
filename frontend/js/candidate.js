
// Load user name from token/storage
window.addEventListener('DOMContentLoaded', () => {
    const name = sessionStorage.getItem('userName') || localStorage.getItem('userName') || 'John';
    document.getElementById('user-name').textContent = name;

    // Load recommendation count from API
    loadDashboardStats();
});

async function loadDashboardStats() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
    // Fetch recommended jobs count
    const res = await fetch(`${API_BASE_URL}/api/recommendations/jobs`, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
        const data = await res.json();
        document.getElementById('stat-recommended').textContent = data.length || 0;
    }
    } catch (e) {
    // backend not running — show placeholder
    document.getElementById('stat-recommended').textContent = '10';
    }

    // Static placeholders for now (no dedicated endpoints)
    document.getElementById('stat-applications').textContent = '12';
    document.getElementById('stat-views').textContent = '48';
    document.getElementById('stat-saved').textContent = '7';
}

function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '../index.html';
}
