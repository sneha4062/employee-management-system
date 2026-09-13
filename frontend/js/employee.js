// Employee portal pages (profile, attendance, team)

// Helper to get initials (e.g. "Aarav Sharma" -> "AS")
function getInitials(name) {
  return (name || 'EM').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

const Employee = {

  // Profile page
  async initProfile() {
    Auth.enforce('employee');

    const user = Auth.getUser();
    if (!user) return;

    const emp = await API.getMyProfile(user.id);
    if (!emp || !emp.id) return;

    const myId = document.getElementById('my-id');
    const myDept = document.getElementById('my-dept');
    const myStatus = document.getElementById('my-status');
    const myJoinDate = document.getElementById('my-join-date');
    if (myId) myId.textContent = emp.id;
    if (myDept) myDept.textContent = emp.department;
    if (myStatus) myStatus.textContent = emp.status;
    if (myJoinDate) myJoinDate.textContent = emp.joinDate;

    const empInitials = document.getElementById('emp-initials');
    const empFullName = document.getElementById('emp-full-name');
    const empRole = document.getElementById('emp-role');
    const empEmail = document.getElementById('emp-email');
    const empPhone = document.getElementById('emp-phone');
    const empCardDept = document.getElementById('emp-card-dept');

    if (empInitials) empInitials.textContent = getInitials(emp.fullName);
    if (empFullName) empFullName.textContent = emp.fullName;
    if (empRole) empRole.textContent = emp.role;
    if (empEmail) empEmail.textContent = emp.email;
    if (empPhone) empPhone.textContent = emp.phone;
    if (empCardDept) empCardDept.textContent = emp.department;
  },

  // Attendance page
  async initAttendance() {
    Auth.enforce('employee');

    const user = Auth.getUser();
    if (!user) return;

    const datePicker = document.getElementById('my-attendance-date');
    if (datePicker) {
      datePicker.value = new Date().toISOString().split('T')[0];
    }

    const check = async () => {
      const targetDate = datePicker ? datePicker.value : new Date().toISOString().split('T')[0];
      const record = await API.getMyAttendance(user.id, targetDate);

      const dateText = document.getElementById('my-attendance-date-text');
      const statusPill = document.getElementById('my-attendance-status');

      if (dateText) dateText.textContent = record?.date || targetDate;
      if (statusPill) {
        const st = record?.status || 'Present';
        statusPill.textContent = st;
        statusPill.className = 'badge ' + (
          st === 'Present' ? 'badge-present' :
          st === 'Late' ? 'badge-late' :
          st === 'On Leave' ? 'badge-leave' : 'badge-absent'
        );
      }
    };

    if (datePicker) {
      datePicker.onchange = check;
    }
    check();
  },

  // Team page
  async initTeam() {
    Auth.enforce('employee');

    const user = Auth.getUser();
    if (!user) return;

    const data = await API.getMyTeam(user.id);
    const dept = data?.department || { name: 'Engineering', lead: 'Team Lead' };
    const colleagues = Array.isArray(data?.colleagues) ? data.colleagues : [];

    const deptNameEl = document.getElementById('team-dept-name');
    const deptLeadEl = document.getElementById('team-dept-lead');
    if (deptNameEl) deptNameEl.textContent = dept.name;
    if (deptLeadEl) deptLeadEl.textContent = dept.lead;

    const grid = document.getElementById('colleagues-grid');
    if (grid) {
      if (colleagues.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">No colleagues found in this department.</div>';
        return;
      }
      grid.innerHTML = colleagues.map(c => `
        <div class="card" style="text-align: center;">
          <div class="user-avatar-initials-lg" style="margin: 0 auto 12px;">${getInitials(c.fullName)}</div>
          <h3 style="font-size: 1.05rem; font-weight: 700;">
            ${c.fullName} ${c.id === user.id ? '<span style="font-size: 0.75rem; color: var(--primary);">(You)</span>' : ''}
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${c.role}</p>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;"><i class="fa-solid fa-envelope"></i> ${c.email}</p>
        </div>
      `).join('');
    }
  },

  // Settings page
  initSettings() {
    Auth.enforce('employee');
  }
};
