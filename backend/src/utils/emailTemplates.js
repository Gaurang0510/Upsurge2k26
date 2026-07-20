const confirmationEmailHtml = ({ leaderName, teamName, eventName, caseCode, amount, qrDataUrl }) => `
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
                  <td style="padding:8px 0;color:#999;font-size:13px;">Case Reference Code</td>
                  <td style="padding:8px 0;color:#fff;font-size:13px;text-align:right;font-weight:bold;">${caseCode}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#999;font-size:13px;">Amount Paid</td>
                  <td style="padding:8px 0;color:#fff;font-size:13px;text-align:right;">₹${amount}</td>
                </tr>
              </table>
              ${qrDataUrl ? `<div style="text-align:center;margin:20px 0;"><img src="${qrDataUrl}" width="160" height="160" alt="QR Code" style="border:4px solid #fff;border-radius:6px;" /></div>` : ''}
              <p style="font-size:12px;color:#999;line-height:1.6;">
                Please keep this Case Reference Code safe — you'll need it (or the QR code above) for
                on-campus check-in at the venue.
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

module.exports = { confirmationEmailHtml };
