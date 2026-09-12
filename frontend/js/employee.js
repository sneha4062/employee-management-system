// Employee portal pages (profile, attendance, team)

// Helper to get initials (e.g. "Alex Morgan" -> "AM")
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

    document.getElementById('my-id').textContent = emp.id;
    document.getElementById('my-dept').textContent = emp.department;
    document.getElementById('my-status').textContent = emp.status;
    document.getElementById('my-join-date').textContent = emp.joinDate;

    document.getElementById('emp-initials').textContent = getInitials(emp.fullName);
    document.getElementById('emp-full-name').textContent = emp.fullName;
    document.getElementById('emp-role').textContent = emp.role;
    document.getElementById('emp-email').textContent = emp.email;
    document.getElementById('emp-phone').textContent = emp.phone;
    document.getElementById('emp-card-dept').textContent = emp.department;
  },

  // Attendance page
  async initAttendance() {
    Auth.enforce('employee');

    const user = Auth.getUser();
    const datePicker = document.getElementById('my-attendance-date');
    datePicker.value = new Date().toISOString().split('T')[0];

    const check = async () => {
      const record = await API.getMyAttendance(user.id, datePicker.value);

      document.getElementById('my-attendance-date-text').textContent = record.date;
      const statusPill = document.getElementById('my-attendance-status');
      statusPill.textContent = record.status;
      statusPill.className = 'badge ' + (
        record.status === 'Present' ? 'badge-present' :
        record.status === 'Late' ? 'badge-late' :
        record.status === 'On Leave' ? 'badge-leave' : 'badge-absent'
      );
    };

    datePicker.onchange = check;
    check();
  },

  // Team page
  async initTeam() {
    Auth.enforce('employee');

    const user = Auth.getUser();

    const data = await API.getMyTeam(user.id);

    document.getElementById('team-dept-name').textContent = data.department.name;
    document.getElementById('team-dept-lead').textContent = data.department.lead;

    document.getElementById('colleagues-grid').innerHTML = data.colleagues.map(c => `
      <div class="card" style="text-align: center;">
        <div class="user-avatar-initials-lg" style="margin: 0 auto 12px;">${getInitials(c.fullName)}</div>
        <h3 style="font-size: 1.05rem; font-weight: 700;">
          ${c.fullName} ${c.id === user.id ? '<span style="font-size: 0.75rem; color: var(--primary);">(You)</span>' : ''}
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${c.role}</p>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;"><i class="fa-solid fa-envelope"></i> ${c.email}</p>
      </div>
    `).join('');
  },

  // Settings page
  initSettings() {
    Auth.enforce('employee');
  }
};
