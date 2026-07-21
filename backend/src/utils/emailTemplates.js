const selectedTeamInvitationEmailHtml = ({ eventName, teamCode, registrationUrl }) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#151515;border:1px solid #C1121F;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#C1121F;padding:20px 24px;">
              <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:1px;">${eventName}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;color:#e5e5e5;">
              <p style="font-size:16px;">Congratulations!</p>
              <p style="font-size:14px;line-height:1.6;">
                Your team has been selected for the next round of <strong style="color:#C1121F;">${eventName}</strong>.
              </p>
              <p style="font-size:13px;color:#999;line-height:1.6;">Use this team code with this same leader email to complete paid registration:</p>
              <p style="font-size:24px;letter-spacing:2px;font-weight:bold;color:#C1121F;margin:24px 0;text-align:center;">${teamCode}</p>
              <p style="font-size:12px;color:#999;line-height:1.6;">
                Do not share this code. It can be used only once and becomes your permanent team code after registration.
              </p>
              ${registrationUrl ? `<p style="text-align:center;margin:24px 0;"><a href="${registrationUrl}" style="display:inline-block;background:#C1121F;color:#fff;padding:12px 18px;border-radius:4px;text-decoration:none;font-size:13px;font-weight:bold;">Complete Paid Registration</a></p>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const confirmationEmailHtml = ({ leaderName, teamName, eventName, registrationCode, amount, qrDataUrl }) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#151515;border:1px solid #C1121F;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#C1121F;padding:20px 24px;">
              <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:1px;">UPSURGE 2K26</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;color:#e5e5e5;">
              <p style="font-size:16px;">Hi ${leaderName},</p>
              <p style="font-size:14px;line-height:1.6;">
                Your registration for <strong style="color:#C1121F;">${eventName}</strong> has been
                <strong style="color:#4ade80;">CONFIRMED</strong>. Welcome aboard, ${teamName}!
              </p>
              <table width="100%" style="margin:16px 0;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#999;font-size:13px;">Registration Code</td>
                  <td style="padding:8px 0;color:#fff;font-size:13px;text-align:right;font-weight:bold;">${registrationCode}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#999;font-size:13px;">Amount Paid</td>
                  <td style="padding:8px 0;color:#fff;font-size:13px;text-align:right;">₹${amount}</td>
                </tr>
              </table>
              ${qrDataUrl ? `<div style="text-align:center;margin:20px 0;"><img src="${qrDataUrl}" width="160" height="160" alt="QR Code" style="border:4px solid #fff;border-radius:6px;" /></div>` : ''}
              <p style="font-size:12px;color:#999;line-height:1.6;">
                Please keep this registration code safe. You can also use it later to track your team status.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#0a0a0a;padding:16px 24px;text-align:center;">
              <p style="font-size:11px;color:#666;margin:0;">CSE Department · YCCE, Nagpur · UPSURGE 2K26</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const paymentRejectedEmailHtml = ({ leaderName, teamName, eventName, reason }) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#151515;border:1px solid #C1121F;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#C1121F;padding:20px 24px;">
              <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:1px;">${eventName}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;color:#e5e5e5;">
              <p style="font-size:16px;">Hi ${leaderName},</p>
              <p style="font-size:14px;line-height:1.6;">
                We reviewed the payment proof submitted by <strong>${teamName}</strong>, but it could not be approved yet.
              </p>
              <p style="font-size:14px;line-height:1.6;color:#ffb3bd;">
                Reason: ${reason || 'The submitted payment proof did not match our verification records.'}
              </p>
              <p style="font-size:12px;color:#999;line-height:1.6;">
                Please log back in with your shortlisted email and submit the corrected payment details again if your team is still eligible.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = { selectedTeamInvitationEmailHtml, confirmationEmailHtml, paymentRejectedEmailHtml };
