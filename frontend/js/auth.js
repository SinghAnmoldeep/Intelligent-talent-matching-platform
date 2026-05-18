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

    // If backend returned no token, login failed (wrong password,
    // unknown email, etc). Surface the server's actual message so the
    // user sees "Invalid password." instead of a generic "Role not found".
    if (!result.token || !result.role) {
      alert(result.message || "Login failed. Please try again.");
      return;
    }

    // Save JWT, role, and membership tier for the dashboard pages
    localStorage.setItem("token", result.token);
    localStorage.setItem("userRole", result.role);
    localStorage.setItem("membership", result.membership || "BASIC");

    // Redirect based on role
    if (result.role === "CANDIDATE") {
      window.location.href = "../pages/candidate-dashboard.html";
    } else if (result.role === "EMPLOYER") {
      window.location.href = "../pages/employer-dashboard.html";
    } else {
      alert("Unknown role: " + result.role);
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
