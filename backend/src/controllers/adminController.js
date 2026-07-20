const jwt = require('jsonwebtoken');
const { Parser: CsvParser } = require('json2csv');
const Admin = require('../models/Admin');
const Team = require('../models/Team');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

const signToken = (admin) =>
  jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/v1/admin/login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(admin);
    res.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/me
const me = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

/**
 * GET /api/v1/admin/teams
 * Query params: eventSlug, status, paymentStatus, search, page, limit
 */
const getTeams = async (req, res, next) => {
  try {
    const { eventSlug, status, paymentStatus, search, page = 1, limit = 25 } = req.query;

    const teamFilter = {};
    if (eventSlug) teamFilter.eventSlug = eventSlug;
    if (status) teamFilter.status = status;
    if (search) {
      teamFilter.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { teamCode: { $regex: search, $options: 'i' } },
        { 'leader.fullName': { $regex: search, $options: 'i' } },
        { 'leader.email': { $regex: search, $options: 'i' } },
        { 'leader.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 25, 200);
    const skip = (pageNum - 1) * limitNum;

    const teams = await Team.find(teamFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const teamIds = teams.map((t) => t._id);
    const regFilter = { teamId: { $in: teamIds } };
    if (paymentStatus) regFilter.paymentStatus = paymentStatus;
    const registrations = await Registration.find(regFilter).lean();
    const regByTeam = Object.fromEntries(registrations.map((r) => [String(r.teamId), r]));

    // If filtering by paymentStatus, drop teams whose registration didn't match
    let merged = teams
      .map((t) => ({ ...t, registration: regByTeam[String(t._id)] || null }))
      .filter((t) => (paymentStatus ? t.registration : true));

    const total = await Team.countDocuments(teamFilter);

    res.json({
      success: true,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      teams: merged,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/teams/:id
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).lean();
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    const registration = await Registration.findOne({ teamId: team._id }).lean();
    res.json({ success: true, team: { ...team, registration } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/admin/teams/:id/status  { status: 'CONFIRMED'|'CANCELLED'|'PENDING' }
const updateTeamStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const team = await Team.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, team });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalTeams, confirmedTeams, pendingTeams, cancelledTeams] = await Promise.all([
      Team.countDocuments(),
      Team.countDocuments({ status: 'CONFIRMED' }),
      Team.countDocuments({ status: 'PENDING' }),
      Team.countDocuments({ status: 'CANCELLED' }),
    ]);

    const revenueAgg = await Registration.aggregate([
      { $match: { paymentStatus: 'CAPTURED' } },
      { $group: { _id: null, total: { $sum: '$amountInINR' }, count: { $sum: 1 } } },
    ]);

    const byEvent = await Team.aggregate([
      {
        $group: {
          _id: { eventSlug: '$eventSlug', eventName: '$eventName' },
          totalTeams: { $sum: 1 },
          confirmed: { $sum: { $cond: [{ $eq: ['$status', 'CONFIRMED'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
        },
      },
      { $sort: { totalTeams: -1 } },
    ]);

    const checkInAgg = await Registration.aggregate([
      {
        $group: {
          _id: null,
          checkedIn: { $sum: { $cond: [{ $eq: ['$qrCheckInStatus', 'CHECKED_IN'] }, 1, 0] } },
          totalCaptured: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'CAPTURED'] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalTeams,
        confirmedTeams,
        pendingTeams,
        cancelledTeams,
        totalRevenueINR: revenueAgg[0]?.total || 0,
        totalPaymentsCaptured: revenueAgg[0]?.count || 0,
        checkedIn: checkInAgg[0]?.checkedIn || 0,
        totalCapturedForCheckIn: checkInAgg[0]?.totalCaptured || 0,
        byEvent: byEvent.map((e) => ({
          eventSlug: e._id.eventSlug,
          eventName: e._id.eventName,
          totalTeams: e.totalTeams,
          confirmed: e.confirmed,
          pending: e.pending,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/export?eventSlug=...  -> CSV download
const exportTeams = async (req, res, next) => {
  try {
    const { eventSlug } = req.query;
    const filter = eventSlug ? { eventSlug } : {};
    const teams = await Team.find(filter).sort({ createdAt: -1 }).lean();
    const teamIds = teams.map((t) => t._id);
    const registrations = await Registration.find({ teamId: { $in: teamIds } }).lean();
    const regByTeam = Object.fromEntries(registrations.map((r) => [String(r.teamId), r]));

    const rows = teams.map((t) => ({
      teamCode: t.teamCode,
      teamName: t.teamName,
      eventName: t.eventName,
      collegeName: t.collegeName,
      department: t.department,
      teamSize: t.teamSize,
      status: t.status,
      leaderName: t.leader?.fullName,
      leaderEmail: t.leader?.email,
      leaderPhone: t.leader?.phone,
      members: (t.members || []).map((m) => m.fullName).join('; '),
      caseCode: regByTeam[String(t._id)]?.caseCode || '',
      paymentStatus: regByTeam[String(t._id)]?.paymentStatus || '',
      amountInINR: regByTeam[String(t._id)]?.amountInINR ?? '',
      qrCheckInStatus: regByTeam[String(t._id)]?.qrCheckInStatus || '',
      registeredAt: t.createdAt,
    }));

    const parser = new CsvParser();
    const csv = parser.parse(rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="upsurge_teams_${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/admin/checkin  { caseCode }
const checkIn = async (req, res, next) => {
  try {
    const { caseCode } = req.body;
    if (!caseCode) return res.status(400).json({ success: false, message: 'caseCode is required' });

    const registration = await Registration.findOne({ caseCode }).populate('teamId');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'No registration found for this code' });
    }
    if (registration.paymentStatus !== 'CAPTURED') {
      return res.status(400).json({ success: false, message: 'Payment not completed for this registration' });
    }
    if (registration.qrCheckInStatus === 'CHECKED_IN') {
      return res.status(409).json({
        success: false,
        message: `Already checked in at ${registration.checkInTimestamp}`,
        team: registration.teamId,
      });
    }

    registration.qrCheckInStatus = 'CHECKED_IN';
    registration.checkInTimestamp = new Date();
    await registration.save();

    res.json({ success: true, message: 'Checked in successfully', team: registration.teamId, registration });
  } catch (err) {
    next(err);
  }
};

// ---- Event management (admin) ----

// GET /api/v1/admin/events
const listEventsAdmin = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ category: 1, name: 1 });
    res.json({ success: true, events });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/admin/events
const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/admin/events/:id
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  me,
  getTeams,
  getTeamById,
  updateTeamStatus,
  getStats,
  exportTeams,
  checkIn,
  listEventsAdmin,
  createEvent,
  updateEvent,
};
