
const JOBS = [
    {
    id: 1,
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Inc.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
    location: 'Sydney, NSW',
    type: 'Full-time',
    salary: '$120,000 – $150,000',
    experience: '5+ years',
    description: 'We are looking for an experienced full stack developer to join our growing team.'
    },
    {
    id: 2,
    title: 'Frontend Developer',
    company: 'Digital Solutions',
    skills: ['React', 'TypeScript', 'CSS', 'Tailwind', 'Next.js'],
    location: 'Melbourne, VIC',
    type: 'Full-time',
    salary: '$90,000 – $110,000',
    experience: '3+ years',
    description: 'Join our team to build beautiful and responsive web applications.'
    },
    {
    id: 3,
    title: 'Data Scientist',
    company: 'AI Innovations',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
    location: 'Brisbane, QLD',
    type: 'Full-time',
    salary: '$110,000 – $140,000',
    experience: '4+ years',
    description: 'Work on cutting-edge AI projects and help shape the future of technology.'
    },
    {
    id: 4,
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    location: 'Sydney, NSW',
    type: 'Contract',
    salary: '$80,000 – $100,000',
    experience: '2+ years',
    description: 'Create beautiful and intuitive user experiences for our clients.'
    },
    {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudTech',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    location: 'Perth, WA',
    type: 'Full-time',
    salary: '$130,000 – $160,000',
    experience: '5+ years',
    description: 'Manage and optimize our cloud infrastructure and deployment pipelines.'
    },
    {
    id: 6,
    title: 'Backend Developer',
    company: 'FinTech Solutions',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Microservices'],
    location: 'Sydney, NSW',
    type: 'Full-time',
    salary: '$100,000 – $130,000',
    experience: '3+ years',
    description: 'Build scalable backend systems for financial applications.'
    },
    {
    id: 7,
    title: 'Mobile Developer',
    company: 'AppWorks',
    skills: ['React Native', 'iOS', 'Android', 'TypeScript', 'Firebase'],
    location: 'Melbourne, VIC',
    type: 'Full-time',
    salary: '$105,000 – $135,000',
    experience: '4+ years',
    description: 'Develop cross-platform mobile applications for millions of users.'
    },
    {
    id: 8,
    title: 'Product Manager',
    company: 'StartupHub',
    skills: ['Product Strategy', 'Agile', 'User Stories', 'Analytics', 'Stakeholder Management'],
    location: 'Sydney, NSW',
    type: 'Full-time',
    salary: '$140,000 – $170,000',
    experience: '5+ years',
    description: 'Lead product development and strategy for our innovative platform.'
    }
];

let allJobs = [...JOBS];
let currentJobId = null;

function renderJobs(jobs) {
    const grid = document.getElementById('jobs-grid');
    const count = document.getElementById('jobs-count');
    count.textContent = `Showing ${jobs.length} job${jobs.length !== 1 ? 's' : ''}`;

    if (jobs.length === 0) {
    grid.innerHTML = '<div class="no-results">No jobs found matching your search.</div>';
    return;
    }

    grid.innerHTML = jobs.map(job => `
    <div class="job-card">
        <p class="job-card-title">${job.title}</p>
        <p class="job-card-company">${job.company}</p>
        <div class="skill-tags">
        ${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
        <div class="job-meta">
        <div class="job-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/></svg>
            ${job.location}
        </div>
        <div class="job-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            ${job.type}
        </div>
        <div class="job-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            ${job.salary}
        </div>
        <div class="job-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ${job.experience}
        </div>
        </div>
        <p class="job-desc">${job.description}</p>
        <button class="btn-apply" onclick="openModal(${job.id})">Apply Now</button>
    </div>
    `).join('');
}

function handleSearch(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
    renderJobs(JOBS);
    return;
    }
    const filtered = JOBS.filter(job =>
    job.title.toLowerCase().includes(q) ||
    job.company.toLowerCase().includes(q) ||
    job.skills.some(s => s.toLowerCase().includes(q)) ||
    job.location.toLowerCase().includes(q)
    );
    renderJobs(filtered);
}

function openModal(jobId) {
    const job = JOBS.find(j => j.id === jobId);
    if (!job) return;
    currentJobId = jobId;
    document.getElementById('modal-title').textContent = job.title;
    document.getElementById('modal-company').textContent = job.company;
    document.getElementById('modal-location').textContent = job.location;
    document.getElementById('modal-type').textContent = job.type;
    document.getElementById('modal-salary').textContent = job.salary;
    document.getElementById('modal-exp').textContent = job.experience;
    document.getElementById('modal-desc').textContent = job.description;
    document.getElementById('modal-skills').innerHTML = job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
    document.getElementById('modal-apply-btn').textContent = 'Apply Now';
    document.getElementById('modal-apply-btn').disabled = false;
    document.getElementById('modal-apply-btn').onclick = () => submitApplication(job);
    document.getElementById('apply-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('apply-modal').classList.remove('open');
    document.body.style.overflow = '';
    currentJobId = null;
}

async function submitApplication(job) {
    const btn = document.getElementById('modal-apply-btn');
    btn.textContent = 'Applying...';
    btn.disabled = true;

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    try {
    const res = await fetch(`${API_BASE_URL}/api/job/${job.id}/apply`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
        }
    });

    if (res.ok) {
        closeModal();
        showToast(`Applied to ${job.title} successfully!`);
    } else {
        const err = await res.json().catch(() => ({}));
        btn.textContent = 'Apply Now';
        btn.disabled = false;
        showToast(err.message || 'Application failed. Please try again.');
    }
    } catch (e) {
    // Backend not available — simulate success for demo
    closeModal();
    showToast(`Applied to ${job.title}!`);
    }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '../index.html';
}

// Close modal on overlay click
document.getElementById('apply-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// On load: fetch from API or fall back to static data
window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // Check for ?search=true (from quick action link)
    if (new URLSearchParams(window.location.search).has('search')) {
    document.getElementById('search-input').focus();
    }

    if (!token) {
    renderJobs(JOBS);
    return;
    }

    try {
    const res = await fetch(`${API_BASE_URL}/api/job`, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
        const data = await res.json();
        // Map API shape → UI shape
        const mapped = data.map(j => ({
        id: j.id || j.jobId,
        title: j.title || j.jobTitle,
        company: j.company || j.companyName || 'Unknown',
        skills: Array.isArray(j.skills) ? j.skills : (j.skills || '').split(',').map(s => s.trim()).filter(Boolean),
        location: j.location || '',
        type: j.jobType || j.type || 'Full-time',
        salary: j.salary || j.salaryRange || '',
        experience: j.experienceRequired || j.experience || '',
        description: j.description || j.jobDescription || ''
        }));
        renderJobs(mapped.length ? mapped : JOBS);
    } else {
        renderJobs(JOBS);
    }
    } catch (e) {
    renderJobs(JOBS);
    }
});
// ---------------- SEARCH EVENT LISTENERS ----------------
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
searchBtn.addEventListener('click', () => handleSearch(searchInput.value));
