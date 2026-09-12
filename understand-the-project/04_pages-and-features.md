# Chapter 4: Pages & UI Features

[<< Previous: Chapter 3 - Roles & Permissions](./03_roles-and-permissions.md) | [Back to Index](./README.md) | [Next: Chapter 5 - Python Flask Guide >>](./05_python-flask-guide.md)

---

Here is the breakdown of what is built on each screen of the application:

---

## 1. Sign-In Page (`frontend/pages/auth/login.html`)
- **2-Button Segmented Toggle**: Switch between `[ Administrator ]` and `[ Employee ]`.
- **Pre-filled Credentials**: Automatically fills the email address when a role button is clicked for quick testing.
- **Action**: Sends a `POST` request with credentials in JSON format to `/api/auth/login`.

---

## 2. Administrator Pages (`frontend/pages/admin/`)

### A. Workforce Directory (`dashboard.html`)
- **Top Stats Cards**: Displays Total Workforce, Active Staff, and On Leave count.
- **Search & Filters**: Live search input (matches name, email, ID, role) + Department filter dropdown + Status filter dropdown.
- **Table**: Shows avatar, name, department badge, role, email, joined date, status, and action buttons.
- **Modals**:
  - **Add Employee**: Input form to create new employee.
  - **Edit Employee**: Pre-populated form to update existing employee.
  - **View Profile**: Detail card for inspecting an employee.
  - **Delete Prompt**: Confirmation dialog to remove an employee.

### B. Departments (`departments.html`)
- **Department Cards Grid**: Shows department name, lead, icon, and dynamic member count.
- **Add Department Modal**: Form to input name, lead, and icon category.

### C. Attendance (`attendance.html`)
- **Date Selector**: Select any calendar day.
- **Daily Counters**: Summary count for Present, Late, On Leave, Absent.
- **Attendance Rows**: 4 clickable pill buttons (`Present`, `Late`, `Leave`, `Absent`) per employee.
- **"Mark All Present" Button**: Sets all employees to "Present" for the selected day in one click.

### D. Settings (`settings.html`)
- Form to edit Company Name, Working Hours, and Default Timezone.

---

## 3. Employee Pages (`frontend/pages/employee/`)

### A. My Profile (`profile.html`)
- **Summary Stats**: Displays My ID, My Department, Status, and Joined Date.
- **Personal ID Card**: Avatar, full name, role, email, phone number, and access permissions.

### B. My Attendance (`attendance.html`)
- **Date Picker**: Check personal attendance status for any selected date.
- **Status Display**: Shows badge (`Present`, `Late`, `On Leave`, `Absent`).

### C. My Team (`team.html`)
- **Department Banner**: Displays assigned department and team lead.
- **Colleagues Grid**: Cards showing all colleagues sharing the same department.

### D. Settings (`settings.html`)
- Personal theme toggle (Dark Mode / Light Mode).

---

[<< Previous: Chapter 3 - Roles & Permissions](./03_roles-and-permissions.md) | [Back to Index](./README.md) | [Next: Chapter 5 - Python Flask Guide >>](./05_python-flask-guide.md)
