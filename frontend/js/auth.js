// Handles auth session, page access, and theme toggle

const Auth = {

  // Get current user from localStorage
  getUser() {
    const raw = localStorage.getItem('teampulse_session');
    return raw ? JSON.parse(raw) : null;
  },

  setUser(userData) {
    localStorage.setItem('teampulse_session', JSON.stringify(userData));
  },

  logout() {
    localStorage.removeItem('teampulse_session');
    // Adjust redirect path based on folder depth
    const isInsidePages = window.location.pathname.includes('/pages/');
    const redirectUrl = isInsidePages ? '../auth/login.html' : 'pages/auth/login.html';
    window.location.href = redirectUrl;
  },

  // Check login status and role before loading page
  enforce(requiredRole) {
    const user = this.getUser();

    if (!user) {
      window.location.replace('../auth/login.html');
      return;
    }

    // Restrict admin pages from regular employees
    if (requiredRole === 'admin' && user.role !== 'admin') {
      window.location.replace('../employee/profile.html');
      return;
    }

    this.updateUI(user);
  },

  // Update sidebar info based on role
  updateUI(user) {
    const adminNav = document.getElementById('admin-nav');
    const employeeNav = document.getElementById('employee-nav');
    if (adminNav && employeeNav) {
      if (user.role === 'admin') {
        adminNav.style.display = 'block';
        employeeNav.style.display = 'none';
      } else {
        adminNav.style.display = 'none';
        employeeNav.style.display = 'block';
      }
    }

    const nameEl = document.getElementById('user-display-name');
    const roleEl = document.getElementById('user-display-role');
    if (nameEl) nameEl.textContent = user.fullName || 'User';
    if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Administrator' : 'Employee';

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = () => this.logout();
    }

    this.initTheme();
  },

  // Dark / light mode toggle
  initTheme() {
    const savedTheme = localStorage.getItem('teampulse_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
      toggleBtn.onclick = () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('teampulse_theme', next);
        if (icon) {
          icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
      };
    }
  }
};
