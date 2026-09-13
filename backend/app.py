"""
Flask backend for the employee management system.
Handles API routes and reads/writes JSON files in data/.
"""

import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
app = Flask(__name__, static_folder=None)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# In-memory storage cache to ensure resilience on read-only serverless hosts (like Vercel)
_MEMORY_CACHE = {}


# Helpers to read and write JSON files in data/

def read_json(filename):
    """Read a JSON file from data/ folder with in-memory fallback."""
    if filename in _MEMORY_CACHE:
        return _MEMORY_CACHE[filename]
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        return []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            _MEMORY_CACHE[filename] = data
            return data
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []


def write_json(filename, data):
    """Save data to a JSON file in data/ folder, with memory fallback for read-only environments."""
    _MEMORY_CACHE[filename] = data
    filepath = os.path.join(DATA_DIR, filename)
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    except OSError:
        # Read-only filesystem (e.g. serverless environments like Vercel)
        pass


# Serve frontend files

@app.route('/')
def serve_index():
    return send_from_directory(frontend_dir, 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    # Handle requests that might include 'frontend/' prefix
    if path.startswith('frontend/'):
        clean_path = path[len('frontend/'):]
        if os.path.exists(os.path.join(frontend_dir, clean_path)):
            return send_from_directory(frontend_dir, clean_path)
    if os.path.exists(os.path.join(frontend_dir, path)):
        return send_from_directory(frontend_dir, path)
    # Default fallback to index.html if file doesn't exist
    return send_from_directory(frontend_dir, 'index.html')


# Auth routes

@app.route('/api/auth/login', methods=['POST'])
def login():
    # Basic login check for admin and employees
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    role = data.get('role', 'admin')

    # Admin login
    if role == 'admin' or 'admin' in email:
        user = {
            "id": "EMP-ADMIN",
            "fullName": "Rajesh Sharma",
            "email": "admin@teampulse.io",
            "role": "admin",
            "department": "Executive"
        }
        return jsonify({"success": True, "user": user}), 200

    # Employee login: match by email
    employees = read_json('employees.json')
    matched = next((e for e in employees if e['email'].lower() == email), None)
    
    if not matched and len(employees) > 0:
        matched = employees[0]  # Fallback to first employee for testing

    if matched:
        user = {
            "id": matched['id'],
            "fullName": matched['fullName'],
            "email": matched['email'],
            "role": "employee",
            "department": matched['department']
        }
        return jsonify({"success": True, "user": user}), 200

    return jsonify({"success": False, "message": "Invalid email or role"}), 401


# Employee routes

@app.route('/api/employees', methods=['GET'])
def get_employees():
    # Return employees with search/filter applied, plus overall count stats
    employees = read_json('employees.json')
    
    search_query = request.args.get('search', '').strip().lower()
    dept_filter = request.args.get('department', 'all')
    status_filter = request.args.get('status', 'all')

    # Counts for dashboard stats
    stats = {
        "total": len(employees),
        "active": sum(1 for e in employees if e.get('status') == 'Active'),
        "onLeave": sum(1 for e in employees if e.get('status') == 'On Leave'),
        "inactive": sum(1 for e in employees if e.get('status') == 'Inactive')
    }

    # Filter by search query, department, and status
    filtered = []
    for emp in employees:
        match_search = not search_query or (
            search_query in emp.get('fullName', '').lower() or
            search_query in emp.get('email', '').lower() or
            search_query in emp.get('role', '').lower() or
            search_query in emp.get('id', '').lower()
        )
        match_dept = (dept_filter == 'all') or (emp.get('department') == dept_filter)
        match_status = (status_filter == 'all') or (emp.get('status') == status_filter)

        if match_search and match_dept and match_status:
            filtered.append(emp)

    return jsonify({
        "employees": filtered,
        "stats": stats
    }), 200


@app.route('/api/employees/<emp_id>', methods=['GET'])
def get_employee(emp_id):
    employees = read_json('employees.json')
    for emp in employees:
        if emp['id'] == emp_id:
            return jsonify(emp), 200
    return jsonify({"error": "Employee not found"}), 404


@app.route('/api/employees', methods=['POST'])
def create_employee():
    data = request.get_json() or {}
    employees = read_json('employees.json')

    # Generate next ID like EMP-1005
    new_id = f"EMP-{1001 + len(employees)}"
    new_emp = {
        "id": new_id,
        "fullName": data.get('fullName', ''),
        "email": data.get('email', ''),
        "phone": data.get('phone', '+1 (555) 000-0000'),
        "department": data.get('department', 'Engineering'),
        "role": data.get('role', 'Team Member'),
        "joinDate": data.get('joinDate', '2026-09-11'),
        "status": data.get('status', 'Active')
    }

    employees.append(new_emp)
    write_json('employees.json', employees)

    return jsonify({"success": True, "employee": new_emp}), 201


@app.route('/api/employees/<emp_id>', methods=['PUT'])
def update_employee(emp_id):
    data = request.get_json() or {}
    employees = read_json('employees.json')

    for emp in employees:
        if emp['id'] == emp_id:
            emp.update(data)
            write_json('employees.json', employees)
            return jsonify({"success": True, "employee": emp}), 200

    return jsonify({"error": "Employee not found"}), 404


@app.route('/api/employees/<emp_id>', methods=['DELETE'])
def delete_employee(emp_id):
    employees = read_json('employees.json')
    initial_len = len(employees)
    employees = [e for e in employees if e['id'] != emp_id]

    if len(employees) < initial_len:
        write_json('employees.json', employees)
        return jsonify({"success": True}), 200

    return jsonify({"error": "Employee not found"}), 404


# Employee self-service

@app.route('/api/employee/profile', methods=['GET'])
def get_my_profile():
    emp_id = request.args.get('id')
    employees = read_json('employees.json')
    
    for emp in employees:
        if emp['id'] == emp_id:
            return jsonify(emp), 200
            
    # Fallback to first employee for testing
    if employees:
        return jsonify(employees[0]), 200
        
    return jsonify({"error": "Profile not found"}), 404


@app.route('/api/employee/team', methods=['GET'])
def get_my_team():
    emp_id = request.args.get('id')
    employees = read_json('employees.json')
    departments = read_json('departments.json')

    # Find the employee
    emp = next((e for e in employees if e['id'] == emp_id), None)
    if not emp and employees:
        emp = employees[0]

    dept_name = emp.get('department', 'Engineering') if emp else 'Engineering'

    # Get department details
    dept_info = next((d for d in departments if d['name'] == dept_name), {
        "name": dept_name,
        "lead": "Team Lead",
        "icon": "fa-solid fa-users"
    })

    # Find colleagues in the same department
    colleagues = [e for e in employees if e.get('department') == dept_name]

    return jsonify({
        "department": dept_info,
        "colleagues": colleagues
    }), 200


# Departments

@app.route('/api/departments', methods=['GET'])
def get_departments():
    # Calculate member count for each department
    departments = read_json('departments.json')
    employees = read_json('employees.json')

    for dept in departments:
        name = dept['name']
        dept['memberCount'] = sum(1 for e in employees if e.get('department') == name)

    return jsonify(departments), 200


@app.route('/api/departments', methods=['POST'])
def create_department():
    data = request.get_json() or {}
    departments = read_json('departments.json')

    dept_name = data.get('name', '').strip()
    if any(d['name'].lower() == dept_name.lower() for d in departments):
        return jsonify({"error": "Department already exists"}), 400

    new_dept = {
        "name": dept_name,
        "lead": data.get('lead', 'TBD'),
        "icon": data.get('icon', 'fa-solid fa-building')
    }
    departments.append(new_dept)
    write_json('departments.json', departments)

    return jsonify({"success": True, "department": new_dept}), 201


# Attendance

@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    # Build attendance list and counters for selected date
    target_date = request.args.get('date', '2026-09-11')
    employees = read_json('employees.json')
    attendance_records = read_json('attendance.json')

    # Map employeeId to status for quick lookup
    record_map = {
        rec['employeeId']: rec['status']
        for rec in attendance_records
        if rec['date'] == target_date
    }

    # Compile attendance for all employees
    compiled = []
    summary = {"present": 0, "late": 0, "onLeave": 0, "absent": 0}

    for emp in employees:
        status = record_map.get(emp['id'], 'Present')
        
        if status == 'Present': summary['present'] += 1
        elif status == 'Late': summary['late'] += 1
        elif status == 'On Leave': summary['onLeave'] += 1
        elif status == 'Absent': summary['absent'] += 1

        compiled.append({
            "employeeId": emp['id'],
            "fullName": emp['fullName'],
            "department": emp['department'],
            "status": status
        })

    return jsonify({
        "records": compiled,
        "summary": summary
    }), 200


@app.route('/api/attendance/me', methods=['GET'])
def get_my_attendance():
    emp_id = request.args.get('id')
    date_val = request.args.get('date', '2026-09-11')
    attendance = read_json('attendance.json')

    record = next((r for r in attendance if r['employeeId'] == emp_id and r['date'] == date_val), None)
    status = record['status'] if record else 'Present'

    return jsonify({
        "date": date_val,
        "status": status
    }), 200


@app.route('/api/attendance', methods=['POST'])
def save_attendance():
    # Save or update attendance record
    data = request.get_json() or {}
    emp_id = data.get('employeeId')
    date_val = data.get('date', '2026-09-11')
    status_val = data.get('status', 'Present')

    attendance = read_json('attendance.json')

    found = False
    for rec in attendance:
        if rec['employeeId'] == emp_id and rec['date'] == date_val:
            rec['status'] = status_val
            found = True
            break

    if not found:
        attendance.append({
            "employeeId": emp_id,
            "date": date_val,
            "status": status_val
        })

    write_json('attendance.json', attendance)
    return jsonify({"success": True}), 200


@app.route('/api/attendance/mark-all-present', methods=['POST'])
def mark_all_present():
    data = request.get_json() or {}
    date_val = data.get('date', '2026-09-11')

    employees = read_json('employees.json')
    attendance = read_json('attendance.json')

    # Clear existing records for this date
    attendance = [r for r in attendance if r['date'] != date_val]

    for emp in employees:
        attendance.append({
            "employeeId": emp['id'],
            "date": date_val,
            "status": "Present"
        })

    write_json('attendance.json', attendance)
    return jsonify({"success": True}), 200


# Settings

@app.route('/api/settings', methods=['GET', 'POST'])
def handle_settings():
    if request.method == 'POST':
        new_settings = request.get_json() or {}
        current = read_json('settings.json')
        if isinstance(current, dict):
            current.update(new_settings)
        else:
            current = new_settings
        write_json('settings.json', current)
        return jsonify({"success": True, "settings": current}), 200

    settings = read_json('settings.json')
    return jsonify(settings), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1')
    print("-------------------------------------------------------")
    print(f" TeamPulse Server (Python + Flask) Running on Port {port}")
    print(" All Business Logic & JSON Data Handled in Python!")
    print(f" Open http://127.0.0.1:{port} in your browser")
    print("-------------------------------------------------------")
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
