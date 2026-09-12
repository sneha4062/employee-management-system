// API helpers to call the Flask backend
const API_BASE = window.location.origin.includes('5000') ? '/api' : 'http://127.0.0.1:5000/api';

const API = {
  // Auth
  async login(email, password, role) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return await res.json();
  },

  // Employees
  async getEmployees(search = '', department = 'all', status = 'all') {
    const url = `${API_BASE}/employees?search=${encodeURIComponent(search)}&department=${encodeURIComponent(department)}&status=${encodeURIComponent(status)}`;
    const res = await fetch(url);
    return await res.json();
  },

  async getEmployee(id) {
    const res = await fetch(`${API_BASE}/employees/${id}`);
    return await res.json();
  },

  async createEmployee(data) {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateEmployee(id, data) {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteEmployee(id) {
    const res = await fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Departments
  async getDepartments() {
    const res = await fetch(`${API_BASE}/departments`);
    return await res.json();
  },

  async createDepartment(data) {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Attendance
  async getAttendance(dateStr) {
    const res = await fetch(`${API_BASE}/attendance?date=${dateStr}`);
    return await res.json();
  },

  async saveAttendance(empId, dateStr, status) {
    const res = await fetch(`${API_BASE}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: empId, date: dateStr, status })
    });
    return await res.json();
  },

  async markAllPresent(dateStr) {
    const res = await fetch(`${API_BASE}/attendance/mark-all-present`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr })
    });
    return await res.json();
  },

  // Employee self-service
  async getMyProfile(empId) {
    const res = await fetch(`${API_BASE}/employee/profile?id=${empId}`);
    return await res.json();
  },

  async getMyTeam(empId) {
    const res = await fetch(`${API_BASE}/employee/team?id=${empId}`);
    return await res.json();
  },

  async getMyAttendance(empId, dateStr) {
    const res = await fetch(`${API_BASE}/attendance/me?id=${empId}&date=${dateStr}`);
    return await res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return await res.json();
  },

  async saveSettings(data) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  }
};
