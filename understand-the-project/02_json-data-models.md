# Chapter 2: JSON Data Models (How Data is Stored)

[<< Previous: Chapter 1 - Project Overview](./01_project-overview.md) | [Back to Index](./README.md) | [Next: Chapter 3 - Roles & Permissions >>](./03_roles-and-permissions.md)

---

All data in this system is stored in simple **JSON files** inside `backend/data/`. This makes it very easy to inspect and edit.

---

## 1. `employees.json`

Stores the list of all employees in the company.

### Fields:
- `id` (String): Unique employee ID (e.g. `"EMP-1001"`).
- `fullName` (String): Full name.
- `email` (String): Work email address.
- `phone` (String): Phone number.
- `department` (String): Department name (e.g. `"Engineering"`).
- `role` (String): Job title / designation.
- `joinDate` (String): Date joined (format: `YYYY-MM-DD`).
- `status` (String): `"Active"`, `"On Leave"`, or `"Inactive"`.

### Example JSON:
```json
[
  {
    "id": "EMP-1001",
    "fullName": "Alex Morgan",
    "email": "alex.morgan@company.com",
    "phone": "+1 (555) 234-5678",
    "department": "Engineering",
    "role": "Senior Frontend Engineer",
    "joinDate": "2023-03-15",
    "status": "Active"
  }
]
```

---

## 2. `departments.json`

Stores department names, their leads, and their icon identifiers.

### Fields:
- `name` (String): Department name (e.g. `"Engineering"`).
- `lead` (String): Name of team lead.
- `icon` (String): FontAwesome icon class name.

### Example JSON:
```json
[
  {
    "name": "Engineering",
    "lead": "David Chen",
    "icon": "fa-solid fa-code"
  }
]
```

---

## 3. `attendance.json`

Stores daily attendance records.

### Fields:
- `date` (String): Date of record (`"YYYY-MM-DD"`).
- `employeeId` (String): ID matching an employee in `employees.json`.
- `status` (String): `"Present"`, `"Late"`, `"On Leave"`, or `"Absent"`.

### Example JSON:
```json
[
  {
    "date": "2026-09-11",
    "employeeId": "EMP-1001",
    "status": "Present"
  }
]
```

---

[<< Previous: Chapter 1 - Project Overview](./01_project-overview.md) | [Back to Index](./README.md) | [Next: Chapter 3 - Roles & Permissions >>](./03_roles-and-permissions.md)
