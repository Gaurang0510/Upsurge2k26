const API_BASE = '/api/v1';
const token = localStorage.getItem('upsurge_admin_token');

if (!token) {
  window.location.href = 'login.html';
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const toastEl = document.getElementById('toast');
const showToast = (msg, ok = false) => {
  toastEl.textContent = msg;
  toastEl.className = `toast show ${ok ? 'ok' : ''}`;
  setTimeout(() => toastEl.classList.remove('show'), 3200);
};

const apiFetch = async (path, opts = {}) => {
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers: authHeaders() });
  if (res.status === 401) {
    localStorage.removeItem('upsurge_admin_token');
    window.location.href = 'login.html';
    throw new Error('Session expired');
  }
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

// ---------------- Sidebar navigation ----------------
const views = { dashboard: 'view-dashboard', teams: 'view-teams', checkin: 'view-checkin' };
document.querySelectorAll('.nav-item[data-view]').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item[data-view]').forEach((i) => i.classList.remove('active'));
    item.classList.add('active');
    Object.values(views).forEach((id) => (document.getElementById(id).style.display = 'none'));
    document.getElementById(views[item.dataset.view]).style.display = 'block';
    if (item.dataset.view === 'dashboard') loadStats();
    if (item.dataset.view === 'teams') loadTeams();
  });
});

// ---------------- Whoami / logout ----------------
try {
  const adminUser = JSON.parse(localStorage.getItem('upsurge_admin_user') || '{}');
  document.getElementById('adminWhoami').textContent = `👤 ${adminUser.username || 'admin'} (${adminUser.role || 'ADMIN'})`;
} catch (e) {}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('upsurge_admin_token');
  localStorage.removeItem('upsurge_admin_user');
  window.location.href = 'login.html';
});

// ---------------- Dashboard / Stats ----------------
const loadStats = async () => {
  try {
    const { stats } = await apiFetch('/admin/stats');
    document.getElementById('statTotal').textContent = stats.totalTeams;
    document.getElementById('statConfirmed').textContent = stats.confirmedTeams;
    document.getElementById('statPending').textContent = stats.pendingTeams;
    document.getElementById('statCancelled').textContent = stats.cancelledTeams;
    document.getElementById('statRevenue').textContent = `₹${stats.totalRevenueINR.toLocaleString('en-IN')}`;
    document.getElementById('statCheckedIn').textContent = `${stats.checkedIn}/${stats.totalCapturedForCheckIn}`;

    const body = document.getElementById('byEventBody');
    if (!stats.byEvent.length) {
      body.innerHTML = `<tr><td colspan="4" class="empty-state">No registrations yet.</td></tr>`;
    } else {
      body.innerHTML = stats.byEvent
        .map(
          (e) => `<tr>
            <td>${escapeHtml(e.eventName)}</td>
            <td class="mono">${e.totalTeams}</td>
            <td class="mono" style="color:var(--ok)">${e.confirmed}</td>
            <td class="mono" style="color:var(--warn)">${e.pending}</td>
          </tr>`
        )
        .join('');
    }
  } catch (err) {
    showToast(err.message);
  }
};

// ---------------- Teams table ----------------
let currentPage = 1;
let totalPages = 1;

const loadEventFilterOptions = async () => {
  try {
    const { events } = await apiFetch('/admin/events');
    const sel = document.getElementById('eventFilter');
    sel.innerHTML =
      '<option value="">All Events</option>' +
      events.map((e) => `<option value="${e.slug}">${escapeHtml(e.name)}</option>`).join('');
  } catch (err) {
    /* non-fatal */
  }
};

const loadTeams = async (page = 1) => {
  currentPage = page;
  const search = document.getElementById('searchInput').value.trim();
  const eventSlug = document.getElementById('eventFilter').value;
  const status = document.getElementById('statusFilter').value;
  const paymentStatus = document.getElementById('paymentFilter').value;

  const params = new URLSearchParams({ page, limit: 25 });
  if (search) params.set('search', search);
  if (eventSlug) params.set('eventSlug', eventSlug);
  if (status) params.set('status', status);
  if (paymentStatus) params.set('paymentStatus', paymentStatus);

  const body = document.getElementById('teamsBody');
  body.innerHTML = `<tr><td colspan="10" class="empty-state">Loading…</td></tr>`;

  try {
    const data = await apiFetch(`/admin/teams?${params.toString()}`);
    totalPages = data.totalPages || 1;

    if (!data.teams.length) {
      body.innerHTML = `<tr><td colspan="10" class="empty-state">No teams match these filters.</td></tr>`;
    } else {
      body.innerHTML = data.teams
        .map((t) => {
          const reg = t.registration || {};
          const date = new Date(t.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
          return `<tr>
            <td class="mono">${escapeHtml(t.teamCode)}</td>
            <td>${escapeHtml(t.teamName)}</td>
            <td>${escapeHtml(t.eventName)}</td>
            <td>${escapeHtml(t.leader?.fullName || '')}<br/><span class="dim small">${escapeHtml(t.leader?.email || '')}</span></td>
            <td class="mono">${t.teamSize}</td>
            <td><span class="badge badge-${t.status}">${t.status}</span></td>
            <td><span class="badge badge-${reg.paymentStatus || 'PENDING'}">${reg.paymentStatus || '—'}</span></td>
            <td><span class="badge badge-${reg.qrCheckInStatus || 'PENDING'}">${reg.qrCheckInStatus || '—'}</span></td>
            <td class="mono">${escapeHtml(reg.caseCode || '—')}</td>
            <td class="dim small">${date}</td>
          </tr>`;
        })
        .join('');
    }

    document.getElementById('pageInfo').textContent = `Page ${data.page} of ${data.totalPages} · ${data.total} total teams`;
  } catch (err) {
    body.innerHTML = `<tr><td colspan="10" class="empty-state">⚠ ${escapeHtml(err.message)}</td></tr>`;
  }
};

document.getElementById('applyFiltersBtn').addEventListener('click', () => loadTeams(1));
document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loadTeams(1);
});
document.getElementById('prevPageBtn').addEventListener('click', () => {
  if (currentPage > 1) loadTeams(currentPage - 1);
});
document.getElementById('nextPageBtn').addEventListener('click', () => {
  if (currentPage < totalPages) loadTeams(currentPage + 1);
});
document.getElementById('refreshStatsBtn').addEventListener('click', loadStats);

document.getElementById('exportBtn').addEventListener('click', () => {
  const eventSlug = document.getElementById('eventFilter').value;
  const params = new URLSearchParams();
  if (eventSlug) params.set('eventSlug', eventSlug);
  fetch(`${API_BASE}/admin/export?${params.toString()}`, { headers: authHeaders() })
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upsurge_teams_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('CSV export downloaded', true);
    })
    .catch(() => showToast('Export failed'));
});

// ---------------- Check-in ----------------
const checkinInput = document.getElementById('checkinInput');
const checkinResult = document.getElementById('checkinResult');

const runCheckIn = async () => {
  const caseCode = checkinInput.value.trim().toUpperCase();
  if (!caseCode) return;

  checkinResult.className = 'checkin-result show';
  checkinResult.textContent = 'Checking…';

  try {
    const res = await fetch(`${API_BASE}/admin/checkin`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ caseCode }),
    });
    const data = await res.json();

    if (res.status === 409) {
      checkinResult.className = 'checkin-result show warn';
      checkinResult.innerHTML = `⚠ Already checked in.<br/>Team: <strong>${escapeHtml(data.team?.teamName || '')}</strong> (${escapeHtml(data.team?.teamCode || '')})`;
      return;
    }
    if (!res.ok || !data.success) {
      checkinResult.className = 'checkin-result show err';
      checkinResult.textContent = `✕ ${data.message}`;
      return;
    }

    checkinResult.className = 'checkin-result show ok';
    checkinResult.innerHTML = `✓ Checked in successfully.<br/>Team: <strong>${escapeHtml(data.team.teamName)}</strong> (${escapeHtml(data.team.teamCode)})<br/>Event: ${escapeHtml(data.team.eventName)} · Size: ${data.team.teamSize}`;
    checkinInput.value = '';
  } catch (err) {
    checkinResult.className = 'checkin-result show err';
    checkinResult.textContent = `✕ ${err.message}`;
  }
};

document.getElementById('checkinBtn').addEventListener('click', runCheckIn);
checkinInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runCheckIn();
});

// ---------------- Utility ----------------
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// ---------------- Init ----------------
loadStats();
loadEventFilterOptions();
