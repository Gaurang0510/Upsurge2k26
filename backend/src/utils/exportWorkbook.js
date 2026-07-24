/**
 * Characters that trigger formula execution in spreadsheet applications.
 * Prefixing with an apostrophe forces the cell to be treated as a text literal.
 */
const FORMULA_TRIGGERS = new Set(['=', '+', '-', '@', '\t', '\r', '\n']);

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Escape a cell value for safe spreadsheet rendering (AUD-013).
 * Prefixes values starting with formula-trigger characters with an apostrophe.
 */
const escapeCellValue = (value) => {
  const str = String(value ?? '');
  if (str.length > 0 && FORMULA_TRIGGERS.has(str[0])) {
    return escapeHtml(`'${str}`);
  }
  return escapeHtml(str);
};

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
      <th>Members</th>
      <th>Created At</th>
      <th>Updated At</th>
    </tr>
  `;

  const body = rows
    .map(
      (row) => `
      <tr>
        <td>${escapeCellValue(row.teamCode)}</td>
        <td>${escapeCellValue(row.registrationCode)}</td>
        <td>${escapeCellValue(row.teamName)}</td>
        <td>${escapeCellValue(row.teamStatus)}</td>
        <td>${escapeCellValue(row.paymentStatus)}</td>
        <td>${escapeCellValue(row.paymentReviewReason)}</td>
        <td>${escapeCellValue(row.leaderName)}</td>
        <td>${escapeCellValue(row.leaderEmail)}</td>
        <td>${escapeCellValue(row.leaderPhone)}</td>
        <td>${escapeCellValue(row.leaderDepartment)}</td>
        <td>${escapeCellValue(row.leaderYear)}</td>
        <td>${escapeCellValue(row.collegeName)}</td>
        <td>${escapeCellValue(row.modePreference)}</td>
        <td>${escapeCellValue(row.problemStatement)}</td>
        <td>${escapeCellValue(row.githubRepositoryUrl)}</td>
        <td>${escapeCellValue(row.utr)}</td>
        <td>${escapeCellValue(row.members)}</td>
        <td>${escapeCellValue(row.createdAt)}</td>
        <td>${escapeCellValue(row.updatedAt)}</td>
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
