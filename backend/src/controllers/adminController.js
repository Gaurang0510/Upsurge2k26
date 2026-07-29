const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const ShortlistEntry = require('../models/ShortlistEntry');
const Team = require('../models/Team');
const { SMACKATHON_CONFIG, MODE_PREFERENCES, TEAM_STATUSES, PAYMENT_STATUSES } = require('../config/smackathon');
const HackathonSetting = require('../models/HackathonSetting');
const { buildExcelHtml } = require('../utils/exportWorkbook');
const { getSignedPaymentScreenshotUrl } = require('../utils/cloudinary');
const { getSlotStats } = require('../utils/slotHelper');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{10,20}$/;
const TEAM_CODE_REGEX = /^\d{6}$/;
const SAFE_TEXT_REGEX = /^[\p{L}\p{N} .,&()\-_/]{0,160}$/u;
const GITHUB_REPOSITORY_REGEX = /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\/?$/;
const MAX_SEARCH_LENGTH = 100;
const MAX_BATCH_LABEL_LENGTH = 120;

const hidePaymentProofUrl = (registration) => {
  if (!registration?.paymentProof) return registration;
  const { screenshotUrl: _screenshotUrl, ...paymentProof } = registration.paymentProof;
  return { ...registration, paymentProof };
};

/**
 * Escape regex metacharacters to prevent ReDoS (AUD-008).
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const signToken = (admin) =>
  jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const parseShortlistEntries = (value) => {
  const entries = String(value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [email, teamCode] = line.split(/[|,;\t]/).map((part) => part.trim());
      return { email: String(email || '').toLowerCase(), invitationCode: String(teamCode || '') };
    });

  if (entries.some(({ email, invitationCode }) => !EMAIL_REGEX.test(email) || !TEAM_CODE_REGEX.test(invitationCode))) {
    const err = new Error('Each line must contain a valid email and six-digit team code separated by |');
    err.statusCode = 400;
    throw err;
  }

  const uniqueEmails = new Set(entries.map(({ email }) => email));
  const uniqueCodes = new Set(entries.map(({ invitationCode }) => invitationCode));
  if (uniqueEmails.size !== entries.length || uniqueCodes.size !== entries.length) {
    const err = new Error('Each shortlisted email and team code must be unique');
    err.statusCode = 400;
    throw err;
  }

  return entries;
};

/**
 * Validate a person (leader or member) for admin edits (AUD-005).
 */
const validatePerson = (person, label) => {
  if (!person || typeof person !== 'object' || Array.isArray(person)) {
    const err = new Error(`${label} details are invalid`);
    err.statusCode = 400;
    throw err;
  }
  if (!person.fullName || String(person.fullName).trim().length < 2) {
    const err = new Error(`${label} must have a valid full name`);
    err.statusCode = 400;
    throw err;
  }
  if (!EMAIL_REGEX.test(String(person.email || '').trim())) {
    const err = new Error(`Invalid email for ${label}`);
    err.statusCode = 400;
    throw err;
  }
  if (!PHONE_REGEX.test(String(person.phone || '').trim())) {
    const err = new Error(`Invalid phone number for ${label}`);
    err.statusCode = 400;
    throw err;
  }
  if (!person.department || String(person.department).trim().length < 1) {
    const err = new Error(`${label} must have a department`);
    err.statusCode = 400;
    throw err;
  }
  if (!person.year || String(person.year).trim().length < 1) {
    const err = new Error(`${label} must have a year`);
    err.statusCode = 400;
    throw err;
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    if (String(username).length > 80 || String(password).length > 200) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: signToken(admin),
      admin: { id: admin._id, username: admin.username, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

const getStats = async (req, res, next) => {
  try {
    const [totalTeams, underReview, confirmed, paymentRejected, verifiedPayments, shortlistCount] = await Promise.all([
      Team.countDocuments(),
      Team.countDocuments({ status: 'PAYMENT_UNDER_REVIEW' }),
      Team.countDocuments({ status: 'CONFIRMED' }),
      Team.countDocuments({ status: 'PAYMENT_REJECTED' }),
      Registration.countDocuments({ paymentStatus: 'VERIFIED' }),
      ShortlistEntry.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      stats: {
        eventName: SMACKATHON_CONFIG.name,
        totalTeams,
        underReview,
        confirmed,
        paymentRejected,
        verifiedPayments,
        shortlistCount,
        feeInINR: SMACKATHON_CONFIG.feeInINR,
        totalRevenueINR: verifiedPayments * SMACKATHON_CONFIG.feeInINR,
        slots: await getSlotStats(),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getTeams = async (req, res, next) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 25 } = req.query;
    const teamFilter = {};

    if (status) {
      if (!TEAM_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid team status filter' });
      }
      teamFilter.status = status;
    }

    // Escape regex metacharacters and cap search length (AUD-008)
    if (search) {
      const sanitizedSearch = escapeRegex(String(search).slice(0, MAX_SEARCH_LENGTH));
      teamFilter.$or = [
        { teamName: { $regex: sanitizedSearch, $options: 'i' } },
        { teamCode: { $regex: sanitizedSearch, $options: 'i' } },
        { shortlistEmail: { $regex: sanitizedSearch, $options: 'i' } },
        { 'leader.fullName': { $regex: sanitizedSearch, $options: 'i' } },
        { 'leader.phone': { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 25, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    if (paymentStatus) {
      if (!PAYMENT_STATUSES.includes(paymentStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid payment status filter' });
      }
      const matchingRegistrations = await Registration.find({ paymentStatus }).select('teamId').lean();
      teamFilter._id = { $in: matchingRegistrations.map((registration) => registration.teamId) };
    }

    const total = await Team.countDocuments(teamFilter);
    const maxPage = Math.max(Math.ceil(total / limitNum), 1);
    const safePage = Math.min(pageNum, maxPage);
    const safeSkip = (safePage - 1) * limitNum;

    const teams = await Team.find(teamFilter).sort({ createdAt: -1 }).skip(safeSkip).limit(limitNum).lean();
    const registrations = await Registration.find({ teamId: { $in: teams.map((team) => team._id) } }).lean();
    const registrationByTeam = Object.fromEntries(
      registrations.map((registration) => [String(registration.teamId), registration])
    );

    const mergedTeams = teams.map((team) => ({
      ...team,
      registration: hidePaymentProofUrl(registrationByTeam[String(team._id)] || null),
    }));

    res.json({
      success: true,
      page: safePage,
      limit: limitNum,
      total,
      totalPages: maxPage,
      teams: mergedTeams,
    });
  } catch (err) {
    next(err);
  }
};

const getTeamById = async (req, res, next) => {
  try {
    // Validate ObjectId format to prevent CastError
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid team ID format' });
    }

    const team = await Team.findById(req.params.id).lean();
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const registration = await Registration.findOne({ teamId: team._id })
      .populate('adminReview.reviewedBy', 'username')
      .lean();

    res.json({ success: true, team: { ...team, registration: hidePaymentProofUrl(registration) } });
  } catch (err) {
    next(err);
  }
};

const getPaymentProof = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid team ID format' });
    }
    const registration = await Registration.findOne({ teamId: req.params.id })
      .select('paymentProof.screenshotPublicId paymentProof.screenshotFormat')
      .lean();
    if (!registration?.paymentProof?.screenshotPublicId) {
      return res.status(404).json({ success: false, message: 'Payment proof not found' });
    }
    res.setHeader('Cache-Control', 'private, no-store');
    res.json({
      success: true,
      url: getSignedPaymentScreenshotUrl({
        publicId: registration.paymentProof.screenshotPublicId,
        format: registration.paymentProof.screenshotFormat,
      }),
    });
  } catch (err) {
    next(err);
  }
};

const updateTeam = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid team ID format' });
    }

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    // Whitelist mutable fields (AUD-005)
    for (const field of ['teamName', 'collegeName', 'problemStatement', 'modePreference', 'githubRepositoryUrl', 'paymentReviewReason']) {
      if (field in req.body) team[field] = req.body[field];
    }

    if (!SAFE_TEXT_REGEX.test(String(team.teamName || '')) || !SAFE_TEXT_REGEX.test(String(team.collegeName || ''))) {
      return res.status(400).json({ success: false, message: 'Team details contain unsupported characters' });
    }

    // Validate problem statement length
    if (team.problemStatement && String(team.problemStatement).length > 120) {
      return res.status(400).json({ success: false, message: 'Problem statement is too long (max 120 characters)' });
    }

    // Validate mode preference against allowed values
    if (team.modePreference && !MODE_PREFERENCES.includes(team.modePreference)) {
      return res.status(400).json({ success: false, message: 'Invalid mode preference' });
    }

    if (team.githubRepositoryUrl && !GITHUB_REPOSITORY_REGEX.test(String(team.githubRepositoryUrl).trim())) {
      return res.status(400).json({ success: false, message: 'GitHub repository link must be a valid https://github.com/owner/repository URL' });
    }
    if (team.githubRepositoryUrl) team.githubRepositoryUrl = String(team.githubRepositoryUrl).trim().replace(/\/$/, '');

    // Validate paymentReviewReason length
    if (team.paymentReviewReason && String(team.paymentReviewReason).length > 300) {
      return res.status(400).json({ success: false, message: 'Payment review reason is too long (max 300 characters)' });
    }

    // Validate leader if provided (AUD-005)
    if (req.body.leader && typeof req.body.leader === 'object') {
      for (const field of ['fullName', 'email', 'phone', 'department', 'year']) {
        if (field in req.body.leader) team.leader[field] = req.body.leader[field];
      }
      validatePerson(team.leader, 'team leader');
      // Normalize leader fields
      team.leader.email = String(team.leader.email || '').trim().toLowerCase();
      team.leader.phone = String(team.leader.phone || '').trim();
    }

    // Validate and normalize members if provided (AUD-005)
    if (Array.isArray(req.body.members)) {
      const normalizedMembers = req.body.members.map((member, index) => {
        const m = {
          memberIndex: index + 2,
          fullName: String(member.fullName || '').trim(),
          email: String(member.email || '').trim().toLowerCase(),
          phone: String(member.phone || '').trim(),
          department: String(member.department || '').trim(),
          year: String(member.year || '').trim(),
        };
        validatePerson(m, `member ${index + 2}`);
        return m;
      });

      // Check for duplicate emails/phones across leader and all members (AUD-015)
      const allEmails = [String(team.leader.email).toLowerCase(), ...normalizedMembers.map((m) => m.email)];
      const allPhones = [String(team.leader.phone).trim(), ...normalizedMembers.map((m) => m.phone)];

      if (new Set(allEmails).size !== allEmails.length) {
        return res.status(400).json({ success: false, message: 'Duplicate email addresses found across team members' });
      }
      if (new Set(allPhones).size !== allPhones.length) {
        return res.status(400).json({ success: false, message: 'Duplicate phone numbers found across team members' });
      }

      team.members = normalizedMembers;
      team.teamSize = 1 + team.members.length;
    }

    if (team.teamSize < SMACKATHON_CONFIG.teamSize.min || team.teamSize > SMACKATHON_CONFIG.teamSize.max) {
      return res.status(400).json({ success: false, message: `Team size must remain between ${SMACKATHON_CONFIG.teamSize.min} and ${SMACKATHON_CONFIG.teamSize.max} members` });
    }

    await team.save();
    res.json({ success: true, team });
  } catch (err) {
    if (err.code === 11000) {
      err.statusCode = 409;
      err.message = 'Updated team details conflict with an existing record';
    }
    next(err);
  }
};

const reviewPayment = async (req, res, next) => {
  // Use a MongoDB transaction so Team + Registration are always consistent (AUD-006)
  const session = await mongoose.startSession();
  try {
    const { decision, reason = '' } = req.body;
    if (!['VERIFIED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'Decision must be VERIFIED or REJECTED' });
    }
    if (String(reason).length > 300) {
      return res.status(400).json({ success: false, message: 'Review reason is too long' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid team ID format' });
    }

    let resultMessage;

    await session.withTransaction(async () => {
      const team = await Team.findById(req.params.id).session(session);
      if (!team) {
        const err = new Error('Team not found');
        err.statusCode = 404;
        throw err;
      }

      const registration = await Registration.findOne({ teamId: team._id }).session(session);
      if (!registration) {
        const err = new Error('Registration not found');
        err.statusCode = 404;
        throw err;
      }

      // Optimistic concurrency: only review if currently UNDER_REVIEW or re-reviewing REJECTED
      if (registration.paymentStatus !== 'UNDER_REVIEW' && registration.paymentStatus !== 'REJECTED') {
        const err = new Error(`Payment has already been ${registration.paymentStatus.toLowerCase()}. Refresh to see current state.`);
        err.statusCode = 409;
        throw err;
      }

      registration.paymentStatus = decision === 'VERIFIED' ? 'VERIFIED' : 'REJECTED';
      registration.adminReview = {
        reviewedBy: req.admin._id,
        reviewedAt: new Date(),
        decision,
        reason: String(reason || '').trim(),
      };

      if (decision === 'VERIFIED') {
        team.status = 'CONFIRMED';
        team.paymentReviewReason = '';
      } else {
        team.status = 'PAYMENT_REJECTED';
        team.paymentReviewReason = String(reason || 'Payment proof could not be verified').trim();
      }

      await team.save({ session });
      await registration.save({ session });

      resultMessage = decision === 'VERIFIED'
        ? 'Payment verified successfully. The team can check its status on the registration page.'
        : 'Payment rejected successfully. The team can check its status on the registration page.';
    });

    res.json({ success: true, message: resultMessage });
  } catch (err) {
    next(err);
  } finally {
    await session.endSession();
  }
};

const exportTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 }).lean();
    const registrations = await Registration.find({ teamId: { $in: teams.map((team) => team._id) } }).lean();
    const registrationByTeam = Object.fromEntries(
      registrations.map((registration) => [String(registration.teamId), registration])
    );

    const rows = teams.map((team) => {
      const registration = registrationByTeam[String(team._id)];
      return {
        teamCode: team.teamCode,
        registrationCode: registration?.registrationCode || '',
        teamName: team.teamName,
        teamStatus: team.status,
        paymentStatus: registration?.paymentStatus || '',
        paymentReviewReason: team.paymentReviewReason || registration?.adminReview?.reason || '',
        leaderName: team.leader.fullName,
        leaderEmail: team.leader.email,
        leaderPhone: team.leader.phone,
        leaderDepartment: team.leader.department,
        leaderYear: team.leader.year,
        collegeName: team.collegeName,
        modePreference: team.modePreference,
        problemStatement: team.problemStatement,
        githubRepositoryUrl: team.githubRepositoryUrl,
        utr: registration?.paymentProof?.utr || '',
        members: (team.members || [])
          .map((member) => `${member.fullName} | ${member.email} | ${member.phone} | ${member.department} | ${member.year}`)
          .join(' || '),
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      };
    });

    const workbook = buildExcelHtml(rows);
    res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="smackathon_registrations_${Date.now()}.xls"`);
    res.status(200).send(workbook);
  } catch (err) {
    next(err);
  }
};

const importShortlist = async (req, res, next) => {
  try {
    const entries = parseShortlistEntries(req.body.entriesText);
    if (!entries.length) {
      return res.status(400).json({ success: false, message: 'Provide at least one email and six-digit team-code pair' });
    }
    if (entries.length > 5000) {
      return res.status(400).json({ success: false, message: 'Import batch is too large' });
    }

    // Validate batch label length (AUD-008)
    const batchLabel = String(req.body.batchLabel || '').trim().slice(0, MAX_BATCH_LABEL_LENGTH);

    const emails = entries.map(({ email }) => email);
    const invitationCodes = entries.map(({ invitationCode }) => invitationCode);
    const [existingEntries, conflictingCode, conflictingTeam] = await Promise.all([
      ShortlistEntry.find({ $or: [{ email: { $in: emails } }, { invitationCode: { $in: invitationCodes } }] })
      .select('email invitationCode')
      .lean(),
      ShortlistEntry.findOne({ invitationCode: { $in: invitationCodes }, email: { $nin: emails } }).select('invitationCode').lean(),
      Team.findOne({ teamCode: { $in: invitationCodes } }).select('teamCode').lean(),
    ]);
    if (conflictingCode) {
      return res.status(409).json({ success: false, message: 'A team code is already assigned to another shortlisted email' });
    }
    if (conflictingTeam) {
      return res.status(409).json({ success: false, message: 'A team code is already used by a registered team' });
    }

    const operations = entries.map(({ email, invitationCode }) => ({
      updateOne: {
        filter: { email },
        update: {
          $set: {
            email,
            invitationCode,
            isActive: true,
            importedBy: req.admin._id,
            importBatchLabel: batchLabel,
          },
        },
        upsert: true,
      },
    }));

    const result = await ShortlistEntry.bulkWrite(operations);

    res.json({
      success: true,
      message: 'Shortlisted email and team-code pairs saved successfully',
      processed: entries.length,
      changed: result.modifiedCount + result.upsertedCount,
    });
  } catch (err) {
    next(err);
  }
};

const getShortlist = async (req, res, next) => {
  try {
    const entries = await ShortlistEntry.find({ isActive: true })
      .sort({ updatedAt: -1 })
      .limit(200)
      .select('email invitationCode registrationSubmittedAt importBatchLabel createdAt')
      .lean();

    res.json({ success: true, entries });
  } catch (err) {
    next(err);
  }
};

const removeShortlistEntry = async (req, res, next) => {
  try {
    const { email } = req.params;
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const entry = await ShortlistEntry.findOne({ email });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Shortlist entry not found' });
    }

    await ShortlistEntry.deleteOne({ email });
    res.json({ success: true, message: 'Shortlisted email removed successfully' });
  } catch (err) {
    next(err);
  }
};

const getSlotSettings = async (req, res, next) => {
  try {
    const slots = await getSlotStats();
    res.json({ success: true, slots });
  } catch (err) {
    next(err);
  }
};

const updateSlotSettings = async (req, res, next) => {
  try {
    const { offlineSlotsTotal, onlineSlotsTotal } = req.body;
    const offlineVal = parseInt(offlineSlotsTotal, 10);
    const onlineVal = parseInt(onlineSlotsTotal, 10);

    if (isNaN(offlineVal) || offlineVal < 0 || isNaN(onlineVal) || onlineVal < 0) {
      return res.status(400).json({ success: false, message: 'Slot totals must be valid non-negative numbers' });
    }

    const settings = await HackathonSetting.getSettings();
    settings.offlineSlotsTotal = offlineVal;
    settings.onlineSlotsTotal = onlineVal;
    if (req.admin && req.admin._id) {
      settings.updatedBy = req.admin._id;
    }
    await settings.save();

    const slots = await getSlotStats();
    res.json({ success: true, message: 'Hackathon slot limits updated successfully', slots });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  me,
  getStats,
  getTeams,
  getTeamById,
  getPaymentProof,
  updateTeam,
  reviewPayment,
  exportTeams,
  importShortlist,
  getShortlist,
  removeShortlistEntry,
  getSlotSettings,
  updateSlotSettings,
};
