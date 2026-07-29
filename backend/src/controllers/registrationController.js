const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');

const Registration = require('../models/Registration');
const ShortlistEntry = require('../models/ShortlistEntry');
const Team = require('../models/Team');
const { SMACKATHON_CONFIG } = require('../config/smackathon');
const { generateRegistrationCode } = require('../utils/generateCode');
const { uploadPaymentScreenshot, deletePaymentScreenshot } = require('../utils/cloudinary');
const { getSlotStats } = require('../utils/slotHelper');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{10,20}$/;
const UTR_REGEX = /^[A-Z0-9-]{8,32}$/;
const TEAM_CODE_REGEX = /^\d{6}$/;
const SAFE_TEXT_REGEX = /^[\p{L}\p{N} .,&()\-_/]{2,120}$/u;
const GITHUB_REPOSITORY_REGEX = /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\/?$/;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizePhone = (phone) => String(phone || '').trim();
const normalizeUtr = (utr) => String(utr || '').trim().toUpperCase();
const normalizeGithubRepositoryUrl = (url) => String(url || '').trim().replace(/\/$/, '');

/**
 * Use the dedicated registration secret when configured. Local development
 * remains compatible with older `.env` files by deriving a domain-separated
 * signing key from JWT_SECRET instead of reusing the admin signing key.
 */
const REGISTRATION_SECRET = () => {
  if (process.env.REGISTRATION_JWT_SECRET) return process.env.REGISTRATION_JWT_SECRET;
  return crypto.createHmac('sha256', process.env.JWT_SECRET).update('smackathon-registration-token').digest('hex');
};

const signAccessToken = ({ email, invitationCode }) =>
  jwt.sign({ email, invitationCode, purpose: 'smackathon-registration' }, REGISTRATION_SECRET(), {
    expiresIn: process.env.REGISTRATION_ACCESS_TTL || '2h',
  });

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, REGISTRATION_SECRET());
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
  if (!person || typeof person !== 'object' || Array.isArray(person)) {
    const err = new Error(`${label} details are invalid`);
    err.statusCode = 400;
    throw err;
  }
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
    const existingTeam = shortlistEntry
      ? await Team.findOne({ teamCode: invitationCode }).select('_id')
      : null;
    const existingRegistration = existingTeam
      ? await Registration.findOne({ teamId: existingTeam._id }).select('paymentStatus')
      : null;

    if (
      !shortlistEntry
      || (!existingRegistration && shortlistEntry.registrationSubmittedAt)
      || (existingRegistration && existingRegistration.paymentStatus !== 'REJECTED')
    ) {
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
      githubRepositoryUrl,
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
    const existingTeam = shortlistEntry
      ? await Team.findOne({ teamCode: invitationCode })
      : null;
    const existingRegistration = existingTeam
      ? await Registration.findOne({ teamId: existingTeam._id })
      : null;

    if (
      !shortlistEntry
      || (!existingRegistration && shortlistEntry.registrationSubmittedAt)
      || (existingRegistration && existingRegistration.paymentStatus !== 'REJECTED')
    ) {
      return res.status(403).json({ success: false, message: 'This team invitation is not eligible for registration' });
    }

    assertRequired(req.body, ['teamName', 'collegeName', 'utr', 'paymentScreenshotDataUri', 'githubRepositoryUrl']);

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

    if (members !== undefined && !Array.isArray(members)) {
      return res.status(400).json({ success: false, message: 'Members must be provided as a list' });
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
    const normalizedGithubRepositoryUrl = normalizeGithubRepositoryUrl(githubRepositoryUrl);
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
    if (!GITHUB_REPOSITORY_REGEX.test(`${normalizedGithubRepositoryUrl}/`)) {
      return res.status(400).json({ success: false, message: 'GitHub repository link must be a valid https://github.com/owner/repository URL' });
    }
    if (!UTR_REGEX.test(normalizedUtr)) {
      return res.status(400).json({ success: false, message: 'UTR format is invalid' });
    }

    // Validate mode preference against allowed enum values
    const validatedModePreference = modePreference === 'ONLINE_REQUEST' ? 'ONLINE_REQUEST' : 'OFFLINE';

    // Enforce dynamic registration slot limits
    const slotStats = await getSlotStats();
    if (validatedModePreference === 'OFFLINE') {
      const holdsOfflineSlot = existingTeam && existingTeam.modePreference === 'OFFLINE';
      if (!holdsOfflineSlot && slotStats.offline.remaining <= 0) {
        return res.status(403).json({
          success: false,
          message: 'Offline registration slots are completely filled (0 left). Please select Online Request mode if slots are available.',
        });
      }
    }
    if (validatedModePreference === 'ONLINE_REQUEST') {
      const holdsOnlineSlot = existingTeam && existingTeam.modePreference === 'ONLINE_REQUEST';
      if (!holdsOnlineSlot && slotStats.online.remaining <= 0) {
        return res.status(403).json({
          success: false,
          message: 'Online registration slots are completely filled (0 left).',
        });
      }
    }

    // Check for duplicate emails/phones across leader and all members (AUD-015)
    const allEmails = [normalizedLeaderEmail, ...memberList.map((m) => normalizeEmail(m.email))];
    const allPhones = [normalizedLeaderPhone, ...memberList.map((m) => normalizePhone(m.phone))];

    if (new Set(allEmails).size !== allEmails.length) {
      return res.status(400).json({ success: false, message: 'Each team member must have a unique email address' });
    }
    if (new Set(allPhones).size !== allPhones.length) {
      return res.status(400).json({ success: false, message: 'Each team member must have a unique phone number' });
    }

    const [nameConflict, emailConflict, phoneConflict, utrConflict] = await Promise.all([
      Team.findOne({ teamName: normalizedTeamName, ...(existingTeam ? { _id: { $ne: existingTeam._id } } : {}) }),
      Team.findOne({ 'leader.email': normalizedLeaderEmail, ...(existingTeam ? { _id: { $ne: existingTeam._id } } : {}) }),
      Team.findOne({ 'leader.phone': normalizedLeaderPhone, ...(existingTeam ? { _id: { $ne: existingTeam._id } } : {}) }),
      Registration.findOne({ 'paymentProof.utr': normalizedUtr, ...(existingRegistration ? { _id: { $ne: existingRegistration._id } } : {}) }),
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

    let registrationCode = existingRegistration?.registrationCode || generateRegistrationCode('smackathon');

    if (!existingTeam && await Team.exists({ teamCode: invitationCode })) {
      return res.status(409).json({ success: false, message: 'This team code has already been used for registration' });
    }
    while (!existingRegistration && await Registration.exists({ registrationCode })) registrationCode = generateRegistrationCode('smackathon');

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
      modePreference: validatedModePreference,
      githubRepositoryUrl: normalizedGithubRepositoryUrl,
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
        screenshotFormat: paymentUpload.format,
        utr: normalizedUtr,
      },
    };

    // Atlas supports transactions. If either document cannot be stored, both
    // database documents roll back and the uploaded Cloudinary asset is removed.
    const previousScreenshotPublicId = existingRegistration?.paymentProof?.screenshotPublicId;
    const session = await mongoose.startSession();
    let team;
    let registration;
    try {
      await session.withTransaction(async () => {
        if (existingTeam && existingRegistration) {
          team = await Team.findByIdAndUpdate(existingTeam._id, teamData, { new: true, session });
          registration = await Registration.findByIdAndUpdate(
            existingRegistration._id,
            { ...registrationData, teamId: team._id, adminReview: {} },
            { new: true, session }
          );
        } else {
          [team] = await Team.create([teamData], { session });
          [registration] = await Registration.create([{ ...registrationData, teamId: team._id }], { session });
          await ShortlistEntry.updateOne(
            { _id: shortlistEntry._id, registrationSubmittedAt: null },
            { $set: { registrationSubmittedAt: new Date() } },
            { session }
          );
        }
      });
    } finally {
      await session.endSession();
    }

    if (previousScreenshotPublicId && previousScreenshotPublicId !== paymentUpload.publicId) {
      try {
        await deletePaymentScreenshot(previousScreenshotPublicId);
      } catch (cleanupError) {
        console.error('Previous Cloudinary payment screenshot cleanup failed:', cleanupError.message);
      }
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

const getRegistrationSlots = async (req, res, next) => {
  try {
    const slots = await getSlotStats();
    res.json({ success: true, slots });
  } catch (err) {
    next(err);
  }
};

/**
 * Public status endpoint. Requires BOTH email AND teamCode to prevent
 * enumeration attacks on six-digit codes (AUD-004 IDOR fix).
 * Returns minimal information without internal rejection reasons.
 */
const getRegistrationStatus = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.query.email);
    const teamCode = String(req.query.teamCode || '').trim().toUpperCase();

    // Require both fields to prevent IDOR (AUD-004)
    if (!email || !teamCode) {
      return res.status(400).json({ success: false, message: 'Both email and team code are required' });
    }

    if (!EMAIL_REGEX.test(email) || !TEAM_CODE_REGEX.test(teamCode)) {
      return res.status(400).json({ success: false, message: 'Invalid email or team code format' });
    }

    // Require both email AND teamCode to match the same team
    const team = await Team.findOne({ teamCode, shortlistEmail: email }).lean();
    if (!team) {
      return res.status(404).json({ success: false, message: 'No registration found for the provided details' });
    }

    const registration = await Registration.findOne({ teamId: team._id }).lean();
    const slots = await getSlotStats();

    res.json({
      success: true,
      team: {
        teamCode: team.teamCode,
        teamName: team.teamName,
        status: team.status,
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
      slots,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyInvitation,
  submitRegistration,
  getRegistrationSlots,
  getRegistrationStatus,
};
