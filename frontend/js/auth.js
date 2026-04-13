document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");

  if (form) {
    form.addEventListener("submit", signup);
  }
});

async function signup(event) {
  event.preventDefault();

  const data = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role: document.getElementById("role").value
  };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.text(); // safer for now

    alert(result);
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("Signup failed");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  if (signupForm) {
    signupForm.addEventListener("submit", signup);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", login);
  }
});

async function login(event) {
  event.preventDefault();

  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    console.log(result);

    if (result.token) {
      // Save JWT
      localStorage.setItem("token", result.token);
    }

    if (result.role) {
      // Redirect based on role
      if (result.role === "CANDIDATE") {
        window.location.href = "../pages/candidate-dashboard.html";
      } else if (result.role === "EMPLOYER") {
        window.location.href = "../pages/employer-dashboard.html";
      } else {
        // fallback
        window.location.href = "../pages/login.html";
      }
    } else {
      alert("Role not found. Cannot redirect.");
    }

  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
}
// auth.js
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '../index.html';
    });
  }
});
