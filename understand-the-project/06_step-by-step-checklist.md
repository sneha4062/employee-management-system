# Chapter 6: Step-by-Step Implementation Checklist

[<< Previous: Chapter 5 - Python Flask Guide](./05_python-flask-guide.md) | [Back to Index](./README.md)

---

Follow this checklist to build or extend this application:

---

## Phase 1: Backend Setup (Python)
- [ ] Create `backend/data/` folder with initial JSON files (`employees.json`, `departments.json`, `attendance.json`).
- [ ] Create `backend/app.py` with Flask and `flask_cors`.
- [ ] Implement `read_json_file()` and `write_json_file()` helpers.
- [ ] Implement `/api/auth/login` route.
- [ ] Implement `/api/employees` CRUD routes (`GET`, `POST`, `PUT`, `DELETE`).
- [ ] Implement `/api/departments` routes.
- [ ] Implement `/api/attendance` routes.

---

## Phase 2: Frontend Setup (HTML / CSS / JS)
- [ ] Create `frontend/layout.html` base layout template.
- [ ] Create `frontend/pages/auth/login.html` with the 2-button role toggle.
- [ ] Create `frontend/pages/admin/dashboard.html` with workforce table and modals.
- [ ] Create `frontend/pages/admin/departments.html` with department cards grid.
- [ ] Create `frontend/pages/admin/attendance.html` with date picker and status pills.
- [ ] Create `frontend/pages/employee/profile.html` with personal ID card.
- [ ] Create `frontend/pages/employee/attendance.html` for personal log inspection.
- [ ] Create `frontend/pages/employee/team.html` for department colleagues view.

---

## Phase 3: Testing & Verification
- [ ] Run `python backend/app.py` and verify terminal says server is running on port 5000.
- [ ] Open `http://localhost:5000` in browser.
- [ ] Sign in as **Administrator** and verify you can add, edit, and delete employees.
- [ ] Sign in as **Employee** and verify you can only see your own profile and team.
