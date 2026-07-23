const API_BASE = '/api/v1';
const token = sessionStorage.getItem('upsurge_admin_token');

if (!token) {
  window.location.href = 'login.html';
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const toastEl = document.getElementById('toast');
const showToast = (message, ok = false) => {
  toastEl.textContent = message;
  toastEl.className = `toast show ${ok ? 'ok' : ''}`;
  setTimeout(() => toastEl.classList.remove('show'), 3200);
};

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    sessionStorage.removeItem('upsurge_admin_token');
    sessionStorage.removeItem('upsurge_admin_user');
    window.location.href = 'login.html';
    throw new Error('Session expired');
  }

  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

const views = {
  dashboard: 'view-dashboard',
  teams: 'view-teams',
  shortlist: 'view-shortlist',
};

let currentPage = 1;
let totalPages = 1;
let selectedTeamId = null;

document.querySelectorAll('.nav-item[data-view]').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item[data-view]').forEach((node) => node.classList.remove('active'));
    item.classList.add('active');
    Object.values(views).forEach((id) => {
      document.getElementById(id).style.display = 'none';
    });
    document.getElementById(views[item.dataset.view]).style.display = 'block';

    if (item.dataset.view === 'dashboard') loadStats();
    if (item.dataset.view === 'teams') loadTeams();
    if (item.dataset.view === 'shortlist') loadShortlist();
  });
});

try {
  const admin = JSON.parse(sessionStorage.getItem('upsurge_admin_user') || '{}');
  document.getElementById('adminWhoami').textContent = `${admin.username || 'admin'} (${admin.role || 'ADMIN'})`;
} catch (error) {
  document.getElementById('adminWhoami').textContent = 'admin';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('upsurge_admin_token');
  sessionStorage.removeItem('upsurge_admin_user');
  window.location.href = 'login.html';
});

const loadStats = async () => {
  try {
    const { stats } = await apiFetch('/admin/stats');
    document.getElementById('statShortlist').textContent = stats.shortlistCount;
    document.getElementById('statTotal').textContent = stats.totalTeams;
    document.getElementById('statUnderReview').textContent = stats.underReview;
    document.getElementById('statConfirmed').textContent = stats.confirmed;
    document.getElementById('statRejected').textContent = stats.paymentRejected;
    document.getElementById('statRevenue').textContent = `₹${stats.totalRevenueINR.toLocaleString('en-IN')}`;
  } catch (error) {
    showToast(error.message);
  }
};

const loadTeams = async (page = 1) => {
  currentPage = page;
  const search = document.getElementById('searchInput').value.trim();
  const status = document.getElementById('statusFilter').value;
  const paymentStatus = document.getElementById('paymentFilter').value;

  const params = new URLSearchParams({ page, limit: 25 });
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  if (paymentStatus) params.set('paymentStatus', paymentStatus);

  const body = document.getElementById('teamsBody');
  body.innerHTML = '<tr><td colspan="9" class="empty-state">Loading...</td></tr>';

  try {
    const data = await apiFetch(`/admin/teams?${params.toString()}`);
    totalPages = data.totalPages || 1;

    if (!data.teams.length) {
      body.innerHTML = '<tr><td colspan="9" class="empty-state">No registrations match these filters.</td></tr>';
    } else {
      body.innerHTML = data.teams
        .map((team) => {
          const registration = team.registration || {};
          const submittedAt = new Date(team.createdAt).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          });
          return `
            <tr>
              <td class="mono">${escapeHtml(team.teamCode)}</td>
              <td class="mono">${escapeHtml(registration.registrationCode || '—')}</td>
              <td>${escapeHtml(team.teamName)}</td>
              <td>${escapeHtml(team.leader?.fullName || '')}<br/><span class="dim small">${escapeHtml(team.leader?.email || '')}</span></td>
              <td><span class="badge badge-${escapeHtml(team.status)}">${escapeHtml(team.status)}</span></td>
              <td><span class="badge badge-${escapeHtml(registration.paymentStatus || 'UNDER_REVIEW')}">${escapeHtml(registration.paymentStatus || 'UNDER_REVIEW')}</span></td>
              <td class="mono">${escapeHtml(registration.paymentProof?.utr || '—')}</td>
              <td class="dim small">${submittedAt}</td>
              <td><button class="table-btn" data-team-id="${team._id}">Open</button></td>
            </tr>
          `;
        })
        .join('');
    }

    document.getElementById('pageInfo').textContent = `Page ${data.page} of ${data.totalPages} · ${data.total} total teams`;

    body.querySelectorAll('button[data-team-id]').forEach((button) => {
      button.addEventListener('click', () => openTeamDetail(button.dataset.teamId));
    });
  } catch (error) {
    body.innerHTML = `<tr><td colspan="9" class="empty-state">${escapeHtml(error.message)}</td></tr>`;
  }
};

const membersToTextarea = (members = []) =>
  members
    .map((member) => [member.fullName, member.email, member.phone, member.department, member.year].join(' | '))
    .join('\n');

const textareaToMembers = (value) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [fullName = '', email = '', phone = '', department = '', year = ''] = line.split('|').map((part) => part.trim());
      return { fullName, email, phone, department, year };
    });

const openTeamDetail = async (teamId) => {
  try {
    const { team } = await apiFetch(`/admin/teams/${teamId}`);
    selectedTeamId = teamId;
    document.getElementById('detailPanel').style.display = 'block';
    document.getElementById('detailMeta').innerHTML = `
      <div><strong>Team Code:</strong> ${escapeHtml(team.teamCode)}</div>
      <div><strong>Registration Code:</strong> ${escapeHtml(team.registration?.registrationCode || '—')}</div>
      <div><strong>Team Status:</strong> ${escapeHtml(team.status)}</div>
      <div><strong>Payment Status:</strong> ${escapeHtml(team.registration?.paymentStatus || '—')}</div>
      <div><strong>Shortlisted Email:</strong> ${escapeHtml(team.shortlistEmail)}</div>
      <div><strong>UTR:</strong> ${escapeHtml(team.registration?.paymentProof?.utr || '—')}</div>
      <div><strong>Review Reason:</strong> ${escapeHtml(team.paymentReviewReason || team.registration?.adminReview?.reason || '—')}</div>
    `;

    document.getElementById('proofCard').innerHTML = `
      <div class="mono">Payment proof screenshot</div>
      <div class="small dim">Cloudinary URL: <a href="${escapeHtml(team.registration?.paymentProof?.screenshotUrl || '#')}" target="_blank">Open original</a></div>
      ${team.registration?.paymentProof?.screenshotUrl ? `<img src="${escapeHtml(team.registration.paymentProof.screenshotUrl)}" alt="Payment proof" />` : '<div class="small dim">No screenshot uploaded</div>'}
    `;

    document.getElementById('reviewReason').value = team.paymentReviewReason || team.registration?.adminReview?.reason || '';
    document.getElementById('teamNameInput').value = team.teamName || '';
    document.getElementById('collegeNameInput').value = team.collegeName || '';
    document.getElementById('problemStatementInput').value = team.problemStatement || '';
    document.getElementById('modePreferenceInput').value = team.modePreference || 'OFFLINE';
    document.getElementById('githubRepositoryUrlInput').value = team.githubRepositoryUrl || '';
    document.getElementById('leaderNameInput').value = team.leader?.fullName || '';
    document.getElementById('leaderEmailInput').value = team.leader?.email || '';
    document.getElementById('leaderPhoneInput').value = team.leader?.phone || '';
    document.getElementById('leaderDepartmentInput').value = team.leader?.department || '';
    document.getElementById('leaderYearInput').value = team.leader?.year || '';
    document.getElementById('membersInput').value = membersToTextarea(team.members || []);

    document.getElementById('detailPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    showToast(error.message);
  }
};

const saveTeamChanges = async () => {
  if (!selectedTeamId) return;

  const payload = {
    teamName: document.getElementById('teamNameInput').value.trim(),
    collegeName: document.getElementById('collegeNameInput').value.trim(),
    problemStatement: document.getElementById('problemStatementInput').value.trim(),
    modePreference: document.getElementById('modePreferenceInput').value,
    githubRepositoryUrl: document.getElementById('githubRepositoryUrlInput').value.trim(),
    leader: {
      fullName: document.getElementById('leaderNameInput').value.trim(),
      email: document.getElementById('leaderEmailInput').value.trim(),
      phone: document.getElementById('leaderPhoneInput').value.trim(),
      department: document.getElementById('leaderDepartmentInput').value.trim(),
      year: document.getElementById('leaderYearInput').value.trim(),
    },
    members: textareaToMembers(document.getElementById('membersInput').value),
  };

  try {
    await apiFetch(`/admin/teams/${selectedTeamId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    showToast('Team details updated', true);
    loadTeams(currentPage);
    openTeamDetail(selectedTeamId);
  } catch (error) {
    showToast(error.message);
  }
};

const reviewPayment = async (decision) => {
  if (!selectedTeamId) return;
  const reason = document.getElementById('reviewReason').value.trim();

  try {
    await apiFetch(`/admin/teams/${selectedTeamId}/review-payment`, {
      method: 'PATCH',
      body: JSON.stringify({ decision, reason }),
    });
    showToast(decision === 'VERIFIED' ? 'Payment verified' : 'Payment rejected', true);
    loadStats();
    loadTeams(currentPage);
    openTeamDetail(selectedTeamId);
  } catch (error) {
    showToast(error.message);
  }
};

const loadShortlist = async () => {
  const body = document.getElementById('shortlistBody');
  body.innerHTML = '<tr><td colspan="6" class="empty-state">Loading...</td></tr>';

  try {
    const { entries } = await apiFetch('/admin/shortlist');
    if (!entries.length) {
      body.innerHTML = '<tr><td colspan="6" class="empty-state">No selected-team invitations created yet.</td></tr>';
      return;
    }

    body.innerHTML = entries
      .map((entry) => `
        <tr>
          <td>${escapeHtml(entry.email)}</td>
          <td class="mono">${escapeHtml(entry.invitationCode || '—')}</td>
          <td>${entry.registrationSubmittedAt ? '<span class="badge badge-VERIFIED">USED</span>' : '<span class="badge badge-UNDER_REVIEW">AVAILABLE</span>'}</td>
          <td>${entry.registrationSubmittedAt ? '<span class="badge badge-VERIFIED">USED</span>' : '<span class="badge badge-UNDER_REVIEW">AVAILABLE</span>'}</td>
          <td>${escapeHtml(entry.importBatchLabel || '—')}</td>
          <td class="dim small">${new Date(entry.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
        </tr>
      `)
      .join('');
  } catch (error) {
    body.innerHTML = `<tr><td colspan="6" class="empty-state">${escapeHtml(error.message)}</td></tr>`;
  }
};

const importShortlist = async () => {
  const entriesText = document.getElementById('emailsInput').value.trim();
  const batchLabel = document.getElementById('batchLabelInput').value.trim();
  if (!entriesText) {
    showToast('Enter shortlisted email and team-code pairs first');
    return;
  }

  try {
    const data = await apiFetch('/admin/shortlist/import', {
      method: 'POST',
      body: JSON.stringify({ entriesText, batchLabel }),
    });
    showToast(`${data.processed} shortlisted team-code pairs saved`, true);
    document.getElementById('emailsInput').value = '';
    loadShortlist();
    loadStats();
  } catch (error) {
    showToast(error.message);
  }
};

document.getElementById('applyFiltersBtn').addEventListener('click', () => loadTeams(1));
document.getElementById('searchInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') loadTeams(1);
});
document.getElementById('prevPageBtn').addEventListener('click', () => {
  if (currentPage > 1) loadTeams(currentPage - 1);
});
document.getElementById('nextPageBtn').addEventListener('click', () => {
  if (currentPage < totalPages) loadTeams(currentPage + 1);
});
document.getElementById('refreshStatsBtn').addEventListener('click', loadStats);
document.getElementById('saveTeamBtn').addEventListener('click', saveTeamChanges);
document.getElementById('verifyBtn').addEventListener('click', () => reviewPayment('VERIFIED'));
document.getElementById('rejectBtn').addEventListener('click', () => reviewPayment('REJECTED'));
document.getElementById('closeDetailBtn').addEventListener('click', () => {
  document.getElementById('detailPanel').style.display = 'none';
  selectedTeamId = null;
});
document.getElementById('importShortlistBtn').addEventListener('click', importShortlist);
document.getElementById('refreshShortlistBtn').addEventListener('click', loadShortlist);

document.getElementById('exportBtn').addEventListener('click', async () => {
  try {
    const response = await fetch(`${API_BASE}/admin/export`, { headers: authHeaders() });
    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `smackathon_registrations_${Date.now()}.xls`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
    showToast('Excel export downloaded', true);
  } catch (error) {
    showToast(error.message);
  }
});

loadStats();
loadTeams();
