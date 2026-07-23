const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const buildExcelHtml = (rows) => {
  const header = `
    <tr>
      <th>Team Code</th>
      <th>Registration Code</th>
      <th>Team Name</th>
      <th>Team Status</th>
      <th>Payment Status</th>
      <th>Payment Review Reason</th>
      <th>Leader Name</th>
      <th>Leader Email</th>
      <th>Leader Phone</th>
      <th>Leader Department</th>
      <th>Leader Year</th>
      <th>College</th>
      <th>Mode Preference</th>
      <th>Problem Statement</th>
      <th>GitHub Repository</th>
      <th>UPI UTR</th>
      <th>Payment Screenshot URL</th>
      <th>Members</th>
      <th>Created At</th>
      <th>Updated At</th>
    </tr>
  `;

  const body = rows
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(row.teamCode)}</td>
        <td>${escapeHtml(row.registrationCode)}</td>
        <td>${escapeHtml(row.teamName)}</td>
        <td>${escapeHtml(row.teamStatus)}</td>
        <td>${escapeHtml(row.paymentStatus)}</td>
        <td>${escapeHtml(row.paymentReviewReason)}</td>
        <td>${escapeHtml(row.leaderName)}</td>
        <td>${escapeHtml(row.leaderEmail)}</td>
        <td>${escapeHtml(row.leaderPhone)}</td>
        <td>${escapeHtml(row.leaderDepartment)}</td>
        <td>${escapeHtml(row.leaderYear)}</td>
        <td>${escapeHtml(row.collegeName)}</td>
        <td>${escapeHtml(row.modePreference)}</td>
        <td>${escapeHtml(row.problemStatement)}</td>
        <td>${escapeHtml(row.githubRepositoryUrl)}</td>
        <td>${escapeHtml(row.utr)}</td>
        <td>${escapeHtml(row.paymentScreenshotUrl)}</td>
        <td>${escapeHtml(row.members)}</td>
        <td>${escapeHtml(row.createdAt)}</td>
        <td>${escapeHtml(row.updatedAt)}</td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 12px; }
        th, td { border: 1px solid #d0d0d0; padding: 6px 8px; vertical-align: top; text-align: left; }
        th { background: #8b0000; color: #fff; }
      </style>
    </head>
    <body>
      <table>${header}${body}</table>
    </body>
  </html>`;
};

module.exports = { buildExcelHtml };
