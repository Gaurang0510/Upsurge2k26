const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const { confirmationEmailHtml } = require('./emailTemplates');

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

/**
 * Sends the registration confirmation email with an embedded QR code
 * encoding the caseCode (used later for venue check-in).
 */
const sendConfirmationEmail = async ({ leaderEmail, leaderName, teamName, eventName, caseCode, amount }) => {
  const qrDataUrl = await QRCode.toDataURL(caseCode, { margin: 1, width: 320 }).catch(() => null);
  const html = confirmationEmailHtml({ leaderName, teamName, eventName, caseCode, amount, qrDataUrl });

  const t = getTransporter();

  if (!t) {
    console.log(`📧 [DEV MODE] Confirmation email for ${leaderEmail} | Case Code: ${caseCode}`);
    return { simulated: true };
  }

  const info = await t.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: leaderEmail,
    subject: `UPSURGE 2K26 — Registration Confirmed [${caseCode}]`,
    html,
  });

  return info;
};

module.exports = { sendConfirmationEmail };
