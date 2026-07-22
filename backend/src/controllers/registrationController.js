const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Registration = require('../models/Registration');
const ShortlistEntry = require('../models/ShortlistEntry');
const Team = require('../models/Team');
const { SMACKATHON_CONFIG } = require('../config/smackathon');
const { generateRegistrationCode } = require('../utils/generateCode');
const { uploadPaymentScreenshot, deletePaymentScreenshot } = require('../utils/cloudinary');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{10,20}$/;
const UTR_REGEX = /^[A-Z0-9-]{8,32}$/;
const TEAM_CODE_REGEX = /^\d{6}$/;
const SAFE_TEXT_REGEX = /^[a-zA-Z0-9 .,&()\-_/]{2,120}$/;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizePhone = (phone) => String(phone || '').trim();
const normalizeUtr = (utr) => String(utr || '').trim().toUpperCase();

const signAccessToken = ({ email, invitationCode }) =>
  jwt.sign({ email, invitationCode, purpose: 'smackathon-registration' }, process.env.JWT_SECRET, {
    expiresIn: process.env.REGISTRATION_ACCESS_TTL || '2h',
  });

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.purpose === 'smackathon-registration'
      && EMAIL_REGEX.test(decoded.email)
      && TEAM_CODE_REGEX.test(decoded.invitationCode)
      ? decoded
      : null;
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

const verifyInvitation = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const invitationCode = String(req.body.teamCode || '').trim().toUpperCase();
    if (!EMAIL_REGEX.test(email) || !TEAM_CODE_REGEX.test(invitationCode)) {
      return res.status(400).json({ success: false, message: 'Enter the shortlisted leader email and six-digit team code' });
    }

    const shortlistEntry = await ShortlistEntry.findOne({ email, invitationCode, isActive: true });
    if (!shortlistEntry || shortlistEntry.registrationSubmittedAt) {
      return res.status(403).json({ success: false, message: 'This leader email and team code are not eligible for registration' });
    }

    res.json({
      success: true,
      accessToken: signAccessToken({ email, invitationCode }),
      shortlistedEmail: email,
      teamCode: invitationCode,
      message: 'Team invitation verified successfully',
    });
  } catch (err) {
    next(err);
  }
};

const submitRegistration = async (req, res, next) => {
  let paymentUpload;
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

    const verifiedInvitation = verifyAccessToken(accessToken);
    if (!verifiedInvitation) {
      return res.status(401).json({ success: false, message: 'Please verify your shortlisted team before submitting registration details' });
    }
    const verifiedEmail = normalizeEmail(verifiedInvitation.email);
    const invitationCode = String(verifiedInvitation.invitationCode).trim().toUpperCase();

    const shortlistEntry = await ShortlistEntry.findOne({ email: verifiedEmail, invitationCode, isActive: true });
    if (!shortlistEntry || shortlistEntry.registrationSubmittedAt) {
      return res.status(403).json({ success: false, message: 'This team invitation is not eligible for registration' });
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

    let registrationCode = generateRegistrationCode('smackathon');

    if (await Team.exists({ teamCode: invitationCode })) {
      return res.status(409).json({ success: false, message: 'This team code has already been used for registration' });
    }
    while (await Registration.exists({ registrationCode })) registrationCode = generateRegistrationCode('smackathon');

    paymentUpload = await uploadPaymentScreenshot({
      dataUri: paymentScreenshotDataUri,
      filename: registrationCode,
    });

    const teamData = {
      teamCode: invitationCode,
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
    };

    const registrationData = {
      registrationCode,
      shortlistedEmail: verifiedEmail,
      paymentStatus: 'UNDER_REVIEW',
      paymentMethod: SMACKATHON_CONFIG.payment.method,
      amountInINR: SMACKATHON_CONFIG.feeInINR,
      paymentProof: {
        screenshotUrl: paymentUpload.secureUrl,
        screenshotPublicId: paymentUpload.publicId,
        utr: normalizedUtr,
      },
    };

    // Atlas supports transactions. If either document cannot be stored, both
    // database documents roll back and the uploaded Cloudinary asset is removed.
    const session = await mongoose.startSession();
    let team;
    let registration;
    try {
      await session.withTransaction(async () => {
        [team] = await Team.create([teamData], { session });
        [registration] = await Registration.create([{ ...registrationData, teamId: team._id }], { session });
        await ShortlistEntry.updateOne(
          { _id: shortlistEntry._id, registrationSubmittedAt: null },
          { $set: { registrationSubmittedAt: new Date() } },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully and is pending admin review',
      teamCode: team.teamCode,
      registrationCode: registration.registrationCode,
      paymentStatus: registration.paymentStatus,
    });
  } catch (err) {
    if (paymentUpload?.publicId) {
      try {
        await deletePaymentScreenshot(paymentUpload.publicId);
      } catch (cleanupError) {
        console.error('Cloudinary cleanup failed:', cleanupError.message);
      }
    }
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
  verifyInvitation,
  submitRegistration,
  getRegistrationStatus,
};
