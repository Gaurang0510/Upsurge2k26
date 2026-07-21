const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Registration = require('../models/Registration');
const ShortlistEntry = require('../models/ShortlistEntry');
const Team = require('../models/Team');
const { SMACKATHON_CONFIG } = require('../config/smackathon');
const { generateOtpCode, generateRegistrationCode, generateTeamCode } = require('../utils/generateCode');
const { sendOtpEmail } = require('../utils/sendEmail');
const { uploadPaymentScreenshot } = require('../utils/cloudinary');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{10,20}$/;
const UTR_REGEX = /^[A-Z0-9-]{8,32}$/;
const SAFE_TEXT_REGEX = /^[a-zA-Z0-9 .,&()\-_/]{2,120}$/;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizePhone = (phone) => String(phone || '').trim();
const normalizeUtr = (utr) => String(utr || '').trim().toUpperCase();

const signAccessToken = (email) =>
  jwt.sign({ email, purpose: 'smackathon-registration' }, process.env.JWT_SECRET, {
    expiresIn: process.env.REGISTRATION_ACCESS_TTL || '2h',
  });

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.purpose === 'smackathon-registration' ? decoded.email : null;
  } catch (error) {
    return null;
  }
};

const assertRequired = (payload, fields) => {
  for (const field of fields) {
    if (!payload[field] || String(payload[field]).trim() === '') {
      const err = new Error(`Missing required field: ${field}`);
      err.statusCode = 400;
      throw err;
    }
  }
};

const validatePerson = (person, label) => {
  assertRequired(person, ['fullName', 'email', 'phone', 'department', 'year']);

  if (!EMAIL_REGEX.test(person.email)) {
    const err = new Error(`Invalid email for ${label}`);
    err.statusCode = 400;
    throw err;
  }

  if (!PHONE_REGEX.test(String(person.phone || '').trim())) {
    const err = new Error(`Invalid phone number for ${label}`);
    err.statusCode = 400;
    throw err;
  }
};

const requestOtp = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: 'Enter a valid shortlisted email address' });
    }

    const shortlistEntry = await ShortlistEntry.findOne({ email, isActive: true });
    if (!shortlistEntry) {
      return res.json({
        success: true,
        message: 'If this email is eligible, an OTP has been sent',
      });
    }

    if (shortlistEntry.otpLastSentAt && Date.now() - shortlistEntry.otpLastSentAt.getTime() < 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: 'Please wait at least 60 seconds before requesting another OTP',
      });
    }

    const otp = generateOtpCode();
    shortlistEntry.otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    shortlistEntry.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    shortlistEntry.otpLastSentAt = new Date();
    shortlistEntry.otpAttempts = 0;
    await shortlistEntry.save();

    await sendOtpEmail({ email, otp, eventName: SMACKATHON_CONFIG.name });

    res.json({ success: true, message: 'If this email is eligible, an OTP has been sent' });
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();

    if (!EMAIL_REGEX.test(email) || otp.length !== 6) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit OTP are required' });
    }

    const shortlistEntry = await ShortlistEntry.findOne({ email, isActive: true });
    if (!shortlistEntry?.otpHash || !shortlistEntry.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'OTP not requested for this email' });
    }

    if (shortlistEntry.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Request a new OTP.' });
    }

    if (shortlistEntry.otpAttempts >= 5) {
      return res.status(429).json({ success: false, message: 'Too many invalid attempts. Request a new OTP.' });
    }

    const incomingHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (incomingHash !== shortlistEntry.otpHash) {
      shortlistEntry.otpAttempts += 1;
      await shortlistEntry.save();
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    shortlistEntry.emailVerifiedAt = new Date();
    shortlistEntry.otpHash = null;
    shortlistEntry.otpExpiresAt = null;
    shortlistEntry.otpAttempts = 0;
    await shortlistEntry.save();

    res.json({
      success: true,
      accessToken: signAccessToken(email),
      shortlistedEmail: email,
      message: 'Email verified successfully',
    });
  } catch (err) {
    next(err);
  }
};

const submitRegistration = async (req, res, next) => {
  try {
    const {
      accessToken,
      teamName,
      collegeName,
      problemStatement,
      modePreference,
      leader,
      members,
      utr,
      paymentScreenshotDataUri,
    } = req.body;

    const verifiedEmail = verifyAccessToken(accessToken);
    if (!verifiedEmail) {
      return res.status(401).json({ success: false, message: 'Invalid or expired registration access token' });
    }

    const shortlistEntry = await ShortlistEntry.findOne({ email: verifiedEmail, isActive: true });
    if (!shortlistEntry?.emailVerifiedAt) {
      return res.status(403).json({ success: false, message: 'Verify the shortlisted email first' });
    }

    assertRequired(req.body, ['teamName', 'collegeName', 'utr', 'paymentScreenshotDataUri']);

    if (!leader || typeof leader !== 'object') {
      return res.status(400).json({ success: false, message: 'Leader details are required' });
    }
    validatePerson(leader, 'team leader');

    const normalizedLeaderEmail = normalizeEmail(leader.email);
    if (normalizedLeaderEmail !== verifiedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Leader email must match the verified shortlisted email',
      });
    }

    const memberList = Array.isArray(members) ? members.filter((member) => member && member.fullName) : [];
    memberList.forEach((member, index) => validatePerson(member, `member ${index + 2}`));

    const teamSize = 1 + memberList.length;
    if (teamSize < SMACKATHON_CONFIG.teamSize.min || teamSize > SMACKATHON_CONFIG.teamSize.max) {
      return res.status(400).json({
        success: false,
        message: `Team size must be between ${SMACKATHON_CONFIG.teamSize.min} and ${SMACKATHON_CONFIG.teamSize.max}`,
      });
    }

    const normalizedTeamName = String(teamName).trim();
    const normalizedCollegeName = String(collegeName).trim();
    const normalizedProblemStatement = String(problemStatement || '').trim();
    const normalizedLeaderPhone = normalizePhone(leader.phone);
    const normalizedUtr = normalizeUtr(utr);

    if (!SAFE_TEXT_REGEX.test(normalizedTeamName)) {
      return res.status(400).json({ success: false, message: 'Team name contains unsupported characters' });
    }
    if (!SAFE_TEXT_REGEX.test(normalizedCollegeName)) {
      return res.status(400).json({ success: false, message: 'College name contains unsupported characters' });
    }
    if (normalizedProblemStatement && normalizedProblemStatement.length > 120) {
      return res.status(400).json({ success: false, message: 'Problem statement is too long' });
    }
    if (!UTR_REGEX.test(normalizedUtr)) {
      return res.status(400).json({ success: false, message: 'UTR format is invalid' });
    }

    const [nameConflict, emailConflict, phoneConflict, utrConflict] = await Promise.all([
      Team.findOne({ teamName: normalizedTeamName }),
      Team.findOne({ 'leader.email': normalizedLeaderEmail }),
      Team.findOne({ 'leader.phone': normalizedLeaderPhone }),
      Registration.findOne({ 'paymentProof.utr': normalizedUtr }),
    ]);

    if (nameConflict) {
      return res.status(409).json({ success: false, message: 'Team name already registered' });
    }
    if (emailConflict) {
      return res.status(409).json({ success: false, message: 'This leader email is already registered' });
    }
    if (phoneConflict) {
      return res.status(409).json({ success: false, message: 'This leader phone number is already registered' });
    }
    if (utrConflict) {
      return res.status(409).json({ success: false, message: 'This UTR number is already registered' });
    }

    let teamCode = generateTeamCode();
    let registrationCode = generateRegistrationCode('smackathon');

    while (await Team.exists({ teamCode })) teamCode = generateTeamCode();
    while (await Registration.exists({ registrationCode })) registrationCode = generateRegistrationCode('smackathon');

    const paymentUpload = await uploadPaymentScreenshot({
      dataUri: paymentScreenshotDataUri,
      filename: registrationCode,
    });

    const team = await Team.create({
      teamCode,
      shortlistEmail: verifiedEmail,
      teamName: normalizedTeamName,
      eventSlug: SMACKATHON_CONFIG.slug,
      eventName: SMACKATHON_CONFIG.name,
      collegeName: normalizedCollegeName,
      problemStatement: normalizedProblemStatement,
      modePreference: modePreference === 'ONLINE_REQUEST' ? 'ONLINE_REQUEST' : 'OFFLINE',
      leader: {
        fullName: String(leader.fullName).trim(),
        email: normalizedLeaderEmail,
        phone: normalizedLeaderPhone,
        department: String(leader.department).trim(),
        year: String(leader.year).trim(),
      },
      members: memberList.map((member, index) => ({
        memberIndex: index + 2,
        fullName: String(member.fullName).trim(),
        email: normalizeEmail(member.email),
        phone: normalizePhone(member.phone),
        department: String(member.department).trim(),
        year: String(member.year).trim(),
      })),
      teamSize,
      status: 'PAYMENT_UNDER_REVIEW',
    });

    const registration = await Registration.create({
      registrationCode,
      teamId: team._id,
      shortlistedEmail: verifiedEmail,
      paymentStatus: 'UNDER_REVIEW',
      paymentMethod: SMACKATHON_CONFIG.payment.method,
      amountInINR: SMACKATHON_CONFIG.feeInINR,
      paymentProof: {
        screenshotUrl: paymentUpload.secureUrl,
        screenshotPublicId: paymentUpload.publicId,
        utr: normalizedUtr,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully and is pending admin review',
      teamCode: team.teamCode,
      registrationCode: registration.registrationCode,
      paymentStatus: registration.paymentStatus,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.statusCode = 409;
      err.message = 'A team with the same unique details already exists';
    }
    next(err);
  }
};

const getRegistrationStatus = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.query.email);
    const teamCode = String(req.query.teamCode || '').trim().toUpperCase();

    if (!email && !teamCode) {
      return res.status(400).json({ success: false, message: 'Provide either email or team code' });
    }

    const team = await Team.findOne(teamCode ? { teamCode } : { shortlistEmail: email }).lean();
    if (!team) {
      return res.status(404).json({ success: false, message: 'No registration found for the provided details' });
    }

    const registration = await Registration.findOne({ teamId: team._id }).lean();

    res.json({
      success: true,
      team: {
        teamCode: team.teamCode,
        teamName: team.teamName,
        status: team.status,
        paymentReviewReason: team.paymentReviewReason,
        modePreference: team.modePreference,
      },
      registration: registration
        ? {
            registrationCode: registration.registrationCode,
            paymentStatus: registration.paymentStatus,
            amountInINR: registration.amountInINR,
            updatedAt: registration.updatedAt,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
  submitRegistration,
  getRegistrationStatus,
};
