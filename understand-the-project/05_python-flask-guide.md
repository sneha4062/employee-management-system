# Chapter 5: Python Flask & JSON Communication Guide

[<< Previous: Chapter 4 - Pages & Features](./04_pages-and-features.md) | [Back to Index](./README.md) | [Next: Chapter 6 - Step-by-Step Checklist >>](./06_step-by-step-checklist.md)

---

This chapter explains how **Python Flask** reads JSON files and handles API requests.

---

## 1. How Python Reads and Writes JSON Files

Python has a built-in `json` module.

```python
import json

# Reading a JSON file into a Python list/dict:
with open('data/employees.json', 'r') as f:
    employees = json.load(f)

# Writing a Python list/dict back into a JSON file:
with open('data/employees.json', 'w') as f:
    json.dump(employees, f, indent=2)
```

---

## 2. How Flask Handles JSON Requests & Responses

### A. Receiving JSON from Frontend:
When the frontend sends a POST request with JSON, use `request.get_json()`:
```python
from flask import request

@app.route('/api/employees', methods=['POST'])
def add_employee():
    # 1. Get the JSON dictionary sent from the frontend
    data = request.get_json()
    name = data.get('fullName')
    email = data.get('email')
    
    # 2. Append to employees list and save
    ...
```

### B. Sending JSON back to Frontend:
Use `jsonify()`:
```python
from flask import jsonify

@app.route('/api/employees', methods=['GET'])
def get_all():
    employees = read_json_file('employees.json')
    # Returns the list as JSON with HTTP status code 200 (OK)
    return jsonify(employees), 200
```

---

## 3. The 6 Main API Routes in `backend/app.py`

| Route | HTTP Method | What It Does |
| :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Validates email & role, returns user info. |
| `/api/employees` | `GET` | Returns list of all employees. |
| `/api/employees` | `POST` | Adds a new employee to `employees.json`. |
| `/api/employees/<id>` | `PUT` | Updates an employee by ID. |
| `/api/employees/<id>` | `DELETE` | Removes an employee by ID. |
| `/api/departments` | `GET` | Returns list of departments and member counts. |
| `/api/attendance` | `GET`, `POST` | Gets or updates attendance logs for a specific date. |

---

[<< Previous: Chapter 4 - Pages & Features](./04_pages-and-features.md) | [Back to Index](./README.md) | [Next: Chapter 6 - Step-by-Step Checklist >>](./06_step-by-step-checklist.md)
