// Admin panel logic for dashboard, departments, attendance, and settings

// Helper to get initials (e.g. "Alex Morgan" -> "AM")
function getInitials(name) {
  return (name || 'EM').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

const Admin = {

  // Workforce directory
  async initDashboard() {
    Auth.enforce('admin');

    // Populate department filter dropdowns
    const depts = await API.getDepartments();
    const deptSelect = document.getElementById('filter-dept');
    const modalDeptSelect = document.getElementById('emp-modal-dept');

    if (deptSelect && modalDeptSelect) {
      depts.forEach(d => {
        deptSelect.innerHTML += `<option value="${d.name}">${d.name}</option>`;
        modalDeptSelect.innerHTML += `<option value="${d.name}">${d.name}</option>`;
      });
    }

    // Load and render employee table + stats
    const loadData = async () => {
      const search = document.getElementById('search-input')?.value || '';
      const dept = document.getElementById('filter-dept')?.value || 'all';
      const status = document.getElementById('filter-status')?.value || 'all';

      const result = await API.getEmployees(search, dept, status);

      // Update stats cards
      document.getElementById('stat-total').textContent = result.stats.total;
      document.getElementById('stat-active').textContent = result.stats.active;
      document.getElementById('stat-leave').textContent = result.stats.onLeave;

      const tbody = document.getElementById('employee-table-body');
      if (result.employees.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">No employees found.</td></tr>`;
        return;
      }

      tbody.innerHTML = result.employees.map(emp => `
        <tr>
          <td>
            <div class="user-cell">
              <div class="user-avatar-initials">${getInitials(emp.fullName)}</div>
              <div>
                <div class="user-cell-name">${emp.fullName}</div>
                <div class="user-cell-id">${emp.id}</div>
              </div>
            </div>
          </td>
          <td><span class="badge badge-dept">${emp.department}</span></td>
          <td>${emp.role}</td>
          <td>${emp.email}</td>
          <td>${emp.joinDate}</td>
          <td><span class="badge ${emp.status === 'Active' ? 'badge-active' : emp.status === 'On Leave' ? 'badge-leave' : 'badge-inactive'}">${emp.status}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-action" onclick="Admin.openViewModal('${emp.id}')"><i class="fa-solid fa-eye"></i></button>
              <button class="btn-action" onclick="Admin.openEditModal('${emp.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="btn-action delete" onclick="Admin.deleteEmp('${emp.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
    };

    // Search and filter listeners
    document.getElementById('search-input').oninput = loadData;
    document.getElementById('filter-dept').onchange = loadData;
    document.getElementById('filter-status').onchange = loadData;
    document.getElementById('btn-add-employee').onclick = () => this.openAddModal();

    // Add / Edit form submit
    document.getElementById('employee-form').onsubmit = async (e) => {
      e.preventDefault();
      const id = document.getElementById('emp-modal-id').value;
      const data = {
        fullName: document.getElementById('emp-modal-name').value,
        email: document.getElementById('emp-modal-email').value,
        phone: document.getElementById('emp-modal-phone').value,
        department: document.getElementById('emp-modal-dept').value,
        role: document.getElementById('emp-modal-role').value,
        joinDate: document.getElementById('emp-modal-date').value,
        status: document.getElementById('emp-modal-status').value
      };

      if (id) {
        await API.updateEmployee(id, data);
      } else {
        await API.createEmployee(data);
      }

      this.closeModal('employee-modal');
      loadData();
    };

    loadData();
  },

  openAddModal() {
    document.getElementById('modal-title-text').textContent = 'Add New Employee';
    document.getElementById('emp-modal-id').value = '';
    document.getElementById('employee-form').reset();
    document.getElementById('emp-modal-date').value = new Date().toISOString().split('T')[0];
    this.openModal('employee-modal');
  },

  async openEditModal(id) {
    const emp = await API.getEmployee(id);
    document.getElementById('modal-title-text').textContent = 'Edit Employee';
    document.getElementById('emp-modal-id').value = emp.id;
    document.getElementById('emp-modal-name').value = emp.fullName;
    document.getElementById('emp-modal-email').value = emp.email;
    document.getElementById('emp-modal-phone').value = emp.phone;
    document.getElementById('emp-modal-dept').value = emp.department;
    document.getElementById('emp-modal-role').value = emp.role;
    document.getElementById('emp-modal-date').value = emp.joinDate;
    document.getElementById('emp-modal-status').value = emp.status;
    this.openModal('employee-modal');
  },

  async openViewModal(id) {
    const emp = await API.getEmployee(id);
    document.getElementById('view-initials').textContent = getInitials(emp.fullName);
    document.getElementById('view-name').textContent = emp.fullName;
    document.getElementById('view-role').textContent = emp.role;
    document.getElementById('view-id').textContent = emp.id;
    document.getElementById('view-dept').textContent = emp.department;
    document.getElementById('view-email').textContent = emp.email;
    document.getElementById('view-phone').textContent = emp.phone;
    document.getElementById('view-date').textContent = emp.joinDate;
    document.getElementById('view-status').textContent = emp.status;
    this.openModal('view-modal');
  },

  async deleteEmp(id) {
    if (confirm(`Delete employee ${id}?`)) {
      await API.deleteEmployee(id);
      document.getElementById('search-input').dispatchEvent(new Event('input'));
    }
  },

  // Departments page
  async initDepartments() {
    Auth.enforce('admin');

    const render = async () => {
      const departments = await API.getDepartments();
      document.getElementById('departments-grid').innerHTML = departments.map(d => `
        <div class="card">
          <div class="card-header-flex">
            <div class="card-icon-box"><i class="${d.icon}"></i></div>
            <span class="badge badge-dept">${d.memberCount || 0} Members</span>
          </div>
          <h2 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">${d.name}</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Lead: <strong>${d.lead}</strong></p>
        </div>
      `).join('');
    };

    document.getElementById('btn-add-department').onclick = () => {
      document.getElementById('dept-form').reset();
      this.openModal('dept-modal');
    };

    document.getElementById('dept-form').onsubmit = async (e) => {
      e.preventDefault();
      await API.createDepartment({
        name: document.getElementById('dept-name').value,
        lead: document.getElementById('dept-lead').value,
        icon: document.getElementById('dept-icon').value
      });
      this.closeModal('dept-modal');
      render();
    };

    render();
  },

  // Attendance page
  async initAttendance() {
    Auth.enforce('admin');

    const datePicker = document.getElementById('attendance-date');
    datePicker.value = new Date().toISOString().split('T')[0];

    const render = async () => {
      const data = await API.getAttendance(datePicker.value);

      // Update summary counts
      document.getElementById('count-present').textContent = data.summary.present;
      document.getElementById('count-late').textContent = data.summary.late;
      document.getElementById('count-leave').textContent = data.summary.onLeave;
      document.getElementById('count-absent').textContent = data.summary.absent;

      document.getElementById('attendance-table-body').innerHTML = data.records.map(r => `
        <tr>
          <td>
            <div class="user-cell">
              <div class="user-avatar-initials">${getInitials(r.fullName)}</div>
              <div>
                <div class="user-cell-name">${r.fullName}</div>
                <div class="user-cell-id">${r.employeeId}</div>
              </div>
            </div>
          </td>
          <td>${r.department}</td>
          <td>
            <div class="attendance-pills">
              <button class="pill-btn ${r.status === 'Present' ? 'active present' : ''}" 
                onclick="Admin.markStatus('${r.employeeId}', 'Present')">Present</button>
              <button class="pill-btn ${r.status === 'Late' ? 'active late' : ''}" 
                onclick="Admin.markStatus('${r.employeeId}', 'Late')">Late</button>
              <button class="pill-btn ${r.status === 'On Leave' ? 'active leave' : ''}" 
                onclick="Admin.markStatus('${r.employeeId}', 'On Leave')">Leave</button>
              <button class="pill-btn ${r.status === 'Absent' ? 'active absent' : ''}" 
                onclick="Admin.markStatus('${r.employeeId}', 'Absent')">Absent</button>
            </div>
          </td>
        </tr>
      `).join('');
    };

    datePicker.onchange = render;
    document.getElementById('btn-mark-all-present').onclick = async () => {
      await API.markAllPresent(datePicker.value);
      render();
    };

    render();
  },

  async markStatus(empId, status) {
    const dateVal = document.getElementById('attendance-date').value;
    await API.saveAttendance(empId, dateVal, status);
    this.initAttendance();
  },

  // Settings page
  async initSettings() {
    Auth.enforce('admin');

    const settings = await API.getSettings();
    document.getElementById('setting-company-name').value = settings.companyName || '';
    document.getElementById('setting-hours').value = settings.workingHours || '';
    document.getElementById('setting-timezone').value = settings.timezone || '';

    document.getElementById('settings-form').onsubmit = async (e) => {
      e.preventDefault();
      await API.saveSettings({
        companyName: document.getElementById('setting-company-name').value,
        workingHours: document.getElementById('setting-hours').value,
        timezone: document.getElementById('setting-timezone').value
      });
      alert('Settings saved successfully!');
    };
  },

  // Modal helpers
  openModal(id) { document.getElementById(id).classList.add('open'); },
  closeModal(id) { document.getElementById(id).classList.remove('open'); }
};
