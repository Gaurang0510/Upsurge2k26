const jwt = require('jsonwebtoken');

const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const ShortlistEntry = require('../models/ShortlistEntry');
const Team = require('../models/Team');
const { SMACKATHON_CONFIG } = require('../config/smackathon');
const { generateTeamCode } = require('../utils/generateCode');
const { buildExcelHtml } = require('../utils/exportWorkbook');
const { sendSelectedTeamInvitationEmail, sendConfirmationEmail, sendPaymentRejectedEmail } = require('../utils/sendEmail');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAFE_TEXT_REGEX = /^[a-zA-Z0-9 .,&()\-_/]{0,160}$/;

const signToken = (admin) =>
  jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const parseEmails = (value) =>
  Array.from(
    new Set(
      String(value || '')
        .split(/[\s,;\n\r]+/)
        .map((entry) => entry.trim().toLowerCase())
        .filter((entry) => EMAIL_REGEX.test(entry))
    )
  );

const generateUniqueInvitationCode = async (reservedCodes) => {
  let invitationCode = generateTeamCode();
  while (
    reservedCodes.has(invitationCode) ||
    (await ShortlistEntry.exists({ invitationCode })) ||
    (await Team.exists({ teamCode: invitationCode }))
  ) {
    invitationCode = generateTeamCode();
  }
  reservedCodes.add(invitationCode);
  return invitationCode;
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

    if (status) teamFilter.status = status;
    if (search) {
      teamFilter.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { teamCode: { $regex: search, $options: 'i' } },
        { shortlistEmail: { $regex: search, $options: 'i' } },
        { 'leader.fullName': { $regex: search, $options: 'i' } },
        { 'leader.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 25, 100);
    const skip = (pageNum - 1) * limitNum;

    if (paymentStatus) {
      const matchingRegistrations = await Registration.find({ paymentStatus }).select('teamId').lean();
      teamFilter._id = { $in: matchingRegistrations.map((registration) => registration.teamId) };
    }

    const teams = await Team.find(teamFilter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean();
    const registrations = await Registration.find({ teamId: { $in: teams.map((team) => team._id) } }).lean();
    const registrationByTeam = Object.fromEntries(
      registrations.map((registration) => [String(registration.teamId), registration])
    );

    const mergedTeams = teams.map((team) => ({ ...team, registration: registrationByTeam[String(team._id)] || null }));

    const total = await Team.countDocuments(teamFilter);

    res.json({
      success: true,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      teams: mergedTeams,
    });
  } catch (err) {
    next(err);
  }
};

const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).lean();
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const registration = await Registration.findOne({ teamId: team._id })
      .populate('adminReview.reviewedBy', 'username')
      .lean();

    res.json({ success: true, team: { ...team, registration } });
  } catch (err) {
    next(err);
  }
};

const updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    for (const field of ['teamName', 'collegeName', 'problemStatement', 'modePreference', 'paymentReviewReason']) {
      if (field in req.body) team[field] = req.body[field];
    }

    if (!SAFE_TEXT_REGEX.test(String(team.teamName || '')) || !SAFE_TEXT_REGEX.test(String(team.collegeName || ''))) {
      return res.status(400).json({ success: false, message: 'Team details contain unsupported characters' });
    }

    if (req.body.leader && typeof req.body.leader === 'object') {
      for (const field of ['fullName', 'email', 'phone', 'department', 'year']) {
        if (field in req.body.leader) team.leader[field] = req.body.leader[field];
      }
    }

    if (Array.isArray(req.body.members)) {
      team.members = req.body.members.map((member, index) => ({
        memberIndex: index + 2,
        fullName: member.fullName,
        email: String(member.email || '').trim().toLowerCase(),
        phone: String(member.phone || '').trim(),
        department: member.department,
        year: member.year,
      }));
      team.teamSize = 1 + team.members.length;
    }

    if (team.teamSize < 3 || team.teamSize > 5) {
      return res.status(400).json({ success: false, message: 'Team size must remain between 3 and 5 members' });
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
  try {
    const { decision, reason = '' } = req.body;
    if (!['VERIFIED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'Decision must be VERIFIED or REJECTED' });
    }
    if (String(reason).length > 300) {
      return res.status(400).json({ success: false, message: 'Review reason is too long' });
    }

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    const registration = await Registration.findOne({ teamId: team._id });
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

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
      const now = new Date();
      team.confirmationEmailSentAt = now;
      registration.lastConfirmationEmailAt = now;

      await sendConfirmationEmail({
        leaderEmail: team.leader.email,
        leaderName: team.leader.fullName,
        teamName: team.teamName,
        eventName: team.eventName,
        registrationCode: registration.registrationCode,
        amount: registration.amountInINR,
      });
    } else {
      team.status = 'PAYMENT_REJECTED';
      team.paymentReviewReason = String(reason || 'Payment proof could not be verified').trim();

      await sendPaymentRejectedEmail({
        leaderEmail: team.leader.email,
        leaderName: team.leader.fullName,
        teamName: team.teamName,
        eventName: team.eventName,
        reason: team.paymentReviewReason,
      });
    }

    await Promise.all([team.save(), registration.save()]);

    res.json({
      success: true,
      message: decision === 'VERIFIED' ? 'Payment verified and confirmation sent' : 'Payment rejected',
    });
  } catch (err) {
    next(err);
  }
};

const resendConfirmation = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    const registration = await Registration.findOne({ teamId: team._id });
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

    if (registration.paymentStatus !== 'VERIFIED') {
      return res.status(400).json({ success: false, message: 'Only verified teams can receive confirmation mail' });
    }

    await sendConfirmationEmail({
      leaderEmail: team.leader.email,
      leaderName: team.leader.fullName,
      teamName: team.teamName,
      eventName: team.eventName,
      registrationCode: registration.registrationCode,
      amount: registration.amountInINR,
    });

    const now = new Date();
    team.confirmationEmailSentAt = now;
    registration.lastConfirmationEmailAt = now;
    await Promise.all([team.save(), registration.save()]);

    res.json({ success: true, message: 'Confirmation email resent successfully' });
  } catch (err) {
    next(err);
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
        utr: registration?.paymentProof?.utr || '',
        paymentScreenshotUrl: registration?.paymentProof?.screenshotUrl || '',
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
    const emails = parseEmails(req.body.emailsText);
    if (!emails.length) {
      return res.status(400).json({ success: false, message: 'Provide at least one shortlisted email' });
    }
    if (emails.length > 5000) {
      return res.status(400).json({ success: false, message: 'Import batch is too large' });
    }

    const existingEntries = await ShortlistEntry.find({ email: { $in: emails } })
      .select('email invitationCode')
      .lean();
    const existingByEmail = new Map(existingEntries.map((entry) => [entry.email, entry]));
    const reservedCodes = new Set(existingEntries.map((entry) => entry.invitationCode).filter(Boolean));
    const invitations = [];

    for (const email of emails) {
      const existing = existingByEmail.get(email);
      invitations.push({
        email,
        invitationCode: existing?.invitationCode || (await generateUniqueInvitationCode(reservedCodes)),
      });
    }

    const operations = invitations.map(({ email, invitationCode }) => ({
      updateOne: {
        filter: { email },
        update: {
          $set: {
            email,
            invitationCode,
            isActive: true,
            importedBy: req.admin._id,
            importBatchLabel: String(req.body.batchLabel || '').trim(),
          },
        },
        upsert: true,
      },
    }));

    const result = await ShortlistEntry.bulkWrite(operations);

    // Keep SMTP usage gentle (especially Gmail) instead of opening thousands
    // of connections for a large Unstop shortlist import.
    const deliveryResults = [];
    for (let index = 0; index < invitations.length; index += 5) {
      const batch = invitations.slice(index, index + 5);
      const batchResults = await Promise.allSettled(
        batch.map(({ email, invitationCode }) =>
          sendSelectedTeamInvitationEmail({ leaderEmail: email, eventName: SMACKATHON_CONFIG.name, teamCode: invitationCode })
        )
      );
      deliveryResults.push(...batchResults);
    }
    const deliveredEmails = deliveryResults
      .map((result, index) => (result.status === 'fulfilled' ? invitations[index].email : null))
      .filter(Boolean);
    if (deliveredEmails.length) {
      await ShortlistEntry.updateMany({ email: { $in: deliveredEmails } }, { $set: { invitationSentAt: new Date() } });
    }

    res.json({
      success: true,
      message: 'Selected-team invitations created and sent',
      processed: emails.length,
      changed: result.modifiedCount + result.upsertedCount,
      invitationsSent: deliveredEmails.length,
      invitationFailures: emails.length - deliveredEmails.length,
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
      .select('email invitationCode invitationSentAt registrationSubmittedAt importBatchLabel createdAt')
      .lean();

    res.json({ success: true, entries });
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
  updateTeam,
  reviewPayment,
  resendConfirmation,
  exportTeams,
  importShortlist,
  getShortlist,
};
