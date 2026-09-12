# Chapter 1: Project Overview & Monorepo Structure

[<< Back to Index](./README.md) | [Next: Chapter 2 - JSON Data Models >>](./02_json-data-models.md)

---

## What is a Monorepo?

A **Monorepo** means keeping both the **Frontend** and **Backend** in the same project repository. This makes development simple because you can see everything in one place.

```text
employee_management/
├── backend/                  # Python Flask Backend & JSON Data
│   ├── app.py                # The server code
│   ├── requirements.txt      # Python libraries
│   └── data/                 # JSON database files
│       ├── employees.json
│       ├── departments.json
│       ├── attendance.json
│       └── settings.json
│
├── frontend/                 # Frontend Web Application
│   ├── index.html            # Entry point
│   ├── layout.html           # Base layout template
│   ├── css/
│   │   ├── style.css         # Main styles
│   │   └── login.css         # Login styles
│   ├── js/
│   │   ├── api.js            # Talks to Python server using JSON
│   │   ├── auth.js           # Login check and theme
│   │   ├── admin.js          # Admin pages controller
│   │   └── employee.js       # Employee self-service controller
│   └── pages/
│       ├── auth/login.html
│       ├── admin/            # 4 Admin pages
│       └── employee/         # 4 Employee pages
│
└── understand-the-project/   # These educational guides
```

---

## The Two User Portals

1. **Administrator (HR / Manager)**:
   - Manages all employees (Add, Edit, Delete, View).
   - Manages departments.
   - Marks company-wide daily attendance.
   - Configures company settings.

2. **Employee (Staff Member)**:
   - Sees only their personal ID card and credentials.
   - Checks their own attendance log.
   - Views team lead and colleagues in their department.
   - Personal dark/light theme switcher.

---

[<< Back to Index](./README.md) | [Next: Chapter 2 - JSON Data Models >>](./02_json-data-models.md)
