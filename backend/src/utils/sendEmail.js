const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const {
  otpEmailHtml,
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

/**
 * Sends a shortlist-email OTP.
 */
const sendOtpEmail = async ({ email, otp, eventName }) => {
  const html = otpEmailHtml({ otp, eventName });
  const t = getTransporter();

  if (!t) {
    console.log(`📧 [DEV MODE] OTP email for ${email} | OTP: ${otp}`);
    return { simulated: true };
  }

  return t.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: `${eventName} — Email Verification OTP`,
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

module.exports = { sendOtpEmail, sendConfirmationEmail, sendPaymentRejectedEmail };
