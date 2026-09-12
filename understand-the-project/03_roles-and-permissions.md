# Chapter 3: Roles & Permissions

[<< Previous: Chapter 2 - JSON Data Models](./02_json-data-models.md) | [Back to Index](./README.md) | [Next: Chapter 4 - Pages & Features >>](./04_pages-and-features.md)

---

The system has **two distinct user roles**.

---

## 1. Permission Matrix

| Feature / Action | Administrator | Employee |
| :--- | :---: | :---: |
| View All Employees in Company | Yes | No (Own profile only) |
| Add New Employee | Yes | No |
| Edit Employee Details | Yes | No |
| Delete Employee | Yes | No |
| View All Departments | Yes | No (Own department only) |
| Add Department | Yes | No |
| Mark Daily Attendance for Staff | Yes | No (View-only own log) |
| Use "Mark All Present" Button | Yes | No |
| Edit Company Settings | Yes | No |
| Switch Dark / Light Mode | Yes | Yes |

---

## 2. Privacy Rule

An employee should **never** be allowed to view or edit other employees' private records (such as phone number, status, or attendance). They only have access to their own profile and the names of colleagues in their department.

---

[<< Previous: Chapter 2 - JSON Data Models](./02_json-data-models.md) | [Back to Index](./README.md) | [Next: Chapter 4 - Pages & Features >>](./04_pages-and-features.md)
