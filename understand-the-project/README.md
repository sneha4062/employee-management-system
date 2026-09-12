# TeamPulse: Full-Stack Learning Blueprint

Welcome to the **TeamPulse Learning Guide**! This guide is designed to help you understand how this full-stack Employee Management application works, and how to build a Python Flask backend using JSON data storage.

---

## The Big Picture: How Everything Connects

```text
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (HTML / CSS / JS)            │
│  - User opens browser                                   │
│  - JavaScript sends JSON request: fetch('/api/...')     │
└──────────────────────────┬──────────────────────────────┘
                           │ (JSON via HTTP)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (Python + Flask)                │
│  - app.py receives request: request.get_json()          │
│  - Reads / writes data to JSON files                    │
│  - Returns JSON response: jsonify(...)                  │
└──────────────────────────┬──────────────────────────────┘
                           │ (Read / Write)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   JSON DATA STORAGE                     │
│  - backend/data/employees.json                          │
│  - backend/data/departments.json                        │
│  - backend/data/attendance.json                         │
└─────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Chapters

| Chapter | Guide File | What You Will Learn |
| :---: | :--- | :--- |
| **01** | [**01_project-overview.md**](./01_project-overview.md) | Monorepo folder layout and how pages connect. |
| **02** | [**02_json-data-models.md**](./02_json-data-models.md) | The 3 JSON files and the fields stored inside them. |
| **03** | [**03_roles-and-permissions.md**](./03_roles-and-permissions.md) | Rules for Administrator vs. Employee access. |
| **04** | [**04_pages-and-features.md**](./04_pages-and-features.md) | What buttons, tables, and forms are on each screen. |
| **05** | [**05_python-flask-guide.md**](./05_python-flask-guide.md) | How Python & Flask receive, process, and send JSON. |
| **06** | [**06_step-by-step-checklist.md**](./06_step-by-step-checklist.md) | Step-by-step checklist to build the project. |

---

**Start Reading:** [Chapter 1: Project Overview](./01_project-overview.md)
