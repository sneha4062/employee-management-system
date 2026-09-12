# TeamPulse - Enterprise Employee Management System

A clean, modular **Monorepo** featuring a **Python Flask Backend** (with JSON file storage) and a **Frontend Web Application** (HTML5, CSS3, Vanilla JS).

---

## Monorepo Architecture

```text
employee_management/
├── backend/                         # Python Flask Backend
│   ├── app.py                       # Flask API Server & Static File Host
│   ├── requirements.txt             # flask, flask-cors
│   └── data/                        # JSON Database Storage
│       ├── employees.json           # Employee records
│       ├── departments.json         # Department records
│       ├── attendance.json          # Attendance records
│       └── settings.json            # Company configuration
│
├── frontend/                        # Frontend Web Application
│   ├── index.html                   # Frontend Router
│   ├── layout.html                  # Base Layout Template
│   ├── css/
│   │   ├── style.css                # Application Stylesheet (with Dark Mode)
│   │   └── login.css                # Sign-In Page Stylesheet
│   ├── js/
│   │   ├── api.js                   # JSON API Client (Flask + Local Fallback)
│   │   ├── auth.js                  # Authentication & Role Protection
│   │   ├── admin.js                 # Admin Controller (Workforce, Depts, Attendance)
│   │   └── employee.js              # Employee Controller (Profile, Attendance, Team)
│   └── pages/
│       ├── auth/
│       │   └── login.html           # 2-Button Role Toggle Sign-In
│       ├── admin/
│       │   ├── dashboard.html       # Workforce Directory & CRUD Modals
│       │   ├── departments.html     # Department Cards & Adder
│       │   ├── attendance.html      # Daily Attendance Tracker
│       │   └── settings.html        # Company Preferences
│       └── employee/
│           ├── profile.html         # Personal ID Card
│           ├── attendance.html      # Personal Attendance Log
│           ├── team.html            # Department Colleagues
│           └── settings.html        # Personal Theme Switcher
│
├── understand-the-project/          # Step-by-Step Educational Guides (01 - 06)
│   ├── README.md                    # Roadmap & Table of Contents
│   ├── 01_project-overview.md       # Monorepo architecture & user flow
│   ├── 02_json-data-models.md       # JSON file structures & fields
│   ├── 03_roles-and-permissions.md  # Admin vs. Employee permission rules
│   ├── 04_pages-and-features.md     # Screen-by-screen breakdown
│   ├── 05_python-flask-guide.md     # Python Flask & JSON communication guide
│   └── 06_step-by-step-checklist.md # Step-by-step checklist to build from scratch
│
├── index.html                       # Entry Router
└── README.md                        # Master Documentation
```

---

## How to Run

### Option 1: Full-Stack Mode (Python Flask Server)
1. Open terminal in `backend/`:
   ```bash
   pip install -r requirements.txt
   python app.py
   ```
2. Open **`http://localhost:5000`** in your browser.

### Option 2: Standalone Frontend (Zero Installation)
1. Double-click **`index.html`** in the project folder to open in any browser.
2. The frontend automatically loads mock data from `localStorage`.

---

## Educational Guide

To understand how the codebase works step-by-step:
- [`understand-the-project/README.md`](./understand-the-project/README.md)
