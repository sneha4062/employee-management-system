// API helpers to call the Flask backend

// Dynamically determine the backend API base URL
function getApiBase() {
  // Allow manual override via window.API_BASE if needed
  if (typeof window !== 'undefined' && window.API_BASE) {
    return window.API_BASE.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location) {
    const { hostname, port, protocol } = window.location;

    // Direct local filesystem access
    if (protocol === 'file:') {
      return 'http://127.0.0.1:5000/api';
    }

    // Local dev servers running on a different port than Flask (e.g. Live Server on 5500, Vite on 3000)
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port && port !== '5000') {
      return 'http://127.0.0.1:5000/api';
    }

    // Production environments (Render, Vercel, etc.) or Flask-served (port 5000)
    // Relative '/api' works cleanly across domains without CORS or Mixed Content issues
    return '/api';
  }

  return '/api';
}

const API_BASE = getApiBase();

// Safe fetch wrapper with error handling
async function request(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || `HTTP ${res.status}`, status: res.status };
      }
    }
    return data;
  } catch (err) {
    console.warn(`API request error for ${url}:`, err);
    return {
      success: false,
      error: err.message || 'Network request failed',
      message: 'Unable to connect to the backend server. Please make sure the service is online.'
    };
  }
}

const API = {
  // Auth
  async login(email, password, role) {
    return await request(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
  },

  // Employees
  async getEmployees(search = '', department = 'all', status = 'all') {
    const url = `${API_BASE}/employees?search=${encodeURIComponent(search)}&department=${encodeURIComponent(department)}&status=${encodeURIComponent(status)}`;
    const res = await request(url);
    if (!res || !res.employees) {
      return {
        employees: [],
        stats: { total: 0, active: 0, onLeave: 0, inactive: 0 }
      };
    }
    return res;
  },

  async getEmployee(id) {
    const res = await request(`${API_BASE}/employees/${id}`);
    return res || {};
  },

  async createEmployee(data) {
    return await request(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateEmployee(id, data) {
    return await request(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteEmployee(id) {
    return await request(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
  },

  // Departments
  async getDepartments() {
    const res = await request(`${API_BASE}/departments`);
    return Array.isArray(res) ? res : [];
  },

  async createDepartment(data) {
    return await request(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Attendance
  async getAttendance(dateStr) {
    const res = await request(`${API_BASE}/attendance?date=${dateStr}`);
    if (!res || !res.records) {
      return {
        records: [],
        summary: { present: 0, late: 0, onLeave: 0, absent: 0 }
      };
    }
    return res;
  },

  async saveAttendance(empId, dateStr, status) {
    return await request(`${API_BASE}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: empId, date: dateStr, status })
    });
  },

  async markAllPresent(dateStr) {
    return await request(`${API_BASE}/attendance/mark-all-present`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr })
    });
  },

  // Employee self-service
  async getMyProfile(empId) {
    const res = await request(`${API_BASE}/employee/profile?id=${empId}`);
    return res || {};
  },

  async getMyTeam(empId) {
    const res = await request(`${API_BASE}/employee/team?id=${empId}`);
    if (!res || !res.department) {
      return {
        department: { name: 'Engineering', lead: 'Team Lead', icon: 'fa-solid fa-users' },
        colleagues: []
      };
    }
    return res;
  },

  async getMyAttendance(empId, dateStr) {
    const res = await request(`${API_BASE}/attendance/me?id=${empId}&date=${dateStr}`);
    return res || { date: dateStr, status: 'Present' };
  },

  // Settings
  async getSettings() {
    const res = await request(`${API_BASE}/settings`);
    return res || {
      companyName: 'TeamPulse Enterprise',
      theme: 'light',
      workingHours: '09:00 - 18:00',
      timezone: 'UTC'
    };
  },

  async saveSettings(data) {
    return await request(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};
