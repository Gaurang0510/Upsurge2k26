const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const {
  selectedTeamInvitationEmailHtml,
  confirmationEmailHtml,
  paymentRejectedEmailHtml,
} = require('./emailTemplates');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP not configured — emails will be logged to console instead of sent.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
};

const sendSelectedTeamInvitationEmail = async ({ leaderEmail, eventName, teamCode }) => {
  const frontendBaseUrl = String(process.env.FRONTEND_URL || '').split(',')[0].trim().replace(/\/$/, '');
  const html = selectedTeamInvitationEmailHtml({
    eventName,
    teamCode,
    registrationUrl: frontendBaseUrl ? `${frontendBaseUrl}/register` : '',
  });
  const t = getTransporter();

  if (!t) {
    console.log(`📧 [DEV MODE] Selected-team invitation for ${leaderEmail} | Team Code: ${teamCode}`);
    return { simulated: true };
  }

  return t.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: leaderEmail,
    subject: `${eventName} — You are selected for the next round [${teamCode}]`,
    html,
  });
};

const sendConfirmationEmail = async ({ leaderEmail, leaderName, teamName, eventName, registrationCode, amount }) => {
  const qrDataUrl = await QRCode.toDataURL(registrationCode, { margin: 1, width: 320 }).catch(() => null);
  const html = confirmationEmailHtml({ leaderName, teamName, eventName, registrationCode, amount, qrDataUrl });

  const t = getTransporter();

  if (!t) {
    console.log(`📧 [DEV MODE] Confirmation email for ${leaderEmail} | Registration Code: ${registrationCode}`);
    return { simulated: true };
  }

  const info = await t.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: leaderEmail,
    subject: `SMACKATHON 2K26 — Registration Confirmed [${registrationCode}]`,
    html,
  });

  return info;
};

const sendPaymentRejectedEmail = async ({ leaderEmail, leaderName, teamName, eventName, reason }) => {
  const html = paymentRejectedEmailHtml({ leaderName, teamName, eventName, reason });
  const t = getTransporter();

  if (!t) {
    console.log(`📧 [DEV MODE] Payment rejected email for ${leaderEmail} | Reason: ${reason}`);
    return { simulated: true };
  }

  return t.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: leaderEmail,
    subject: `${eventName} — Payment proof needs correction`,
    html,
  });
};

module.exports = { sendSelectedTeamInvitationEmail, sendConfirmationEmail, sendPaymentRejectedEmail };
