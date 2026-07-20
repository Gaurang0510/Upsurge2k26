const crypto = require('crypto');
const { getRazorpay } = require('../config/razorpay');
const Event = require('../models/Event');
const Team = require('../models/Team');
const Registration = require('../models/Registration');
const { generateTeamCode, generateCaseCode } = require('../utils/generateCode');
const { sendConfirmationEmail } = require('../utils/sendEmail');

/**
 * POST /api/v1/registrations/create-order
 * Step 1 of the payment flow: validates the team, looks up event fee,
 * creates a Razorpay order, and stages PENDING Team + Registration docs.
 */
const createOrder = async (req, res, next) => {
  try {
    const {
      eventSlug,
      teamName,
      collegeName,
      department,
      academicYear,
      leaderName,
      leaderEmail,
      leaderPhone,
      leaderWhatsapp,
      leaderGender,
      leaderTShirtSize,
      members, // array of { fullName, email, phone, college, tShirtSize }
    } = req.body;

    // ---- Basic validation ----
    const requiredFields = { eventSlug, teamName, collegeName, leaderName, leaderEmail, leaderPhone };
    for (const [key, val] of Object.entries(requiredFields)) {
      if (!val || String(val).trim() === '') {
        return res.status(400).json({ success: false, message: `Missing required field: ${key}` });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leaderEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid leader email address' });
    }

    const event = await Event.findOne({ slug: eventSlug, isActive: true });
    if (!event) {
      return res.status(404).json({ success: false, message: `Event '${eventSlug}' not found or inactive` });
    }

    const memberList = Array.isArray(members) ? members.filter((m) => m && m.fullName) : [];
    const teamSize = 1 + memberList.length; // leader + members

    if (teamSize < event.minTeamSize || teamSize > event.maxTeamSize) {
      return res.status(400).json({
        success: false,
        message: `Team size for '${event.name}' must be between ${event.minTeamSize} and ${event.maxTeamSize} (received ${teamSize})`,
      });
    }

    // ---- Generate unique codes ----
    let teamCode, caseCode;
    let attempts = 0;
    do {
      teamCode = generateTeamCode();
      attempts++;
    } while ((await Team.exists({ teamCode })) && attempts < 10);

    attempts = 0;
    do {
      caseCode = generateCaseCode(eventSlug);
      attempts++;
    } while ((await Registration.exists({ caseCode })) && attempts < 10);

    const amountInINR = event.feeInINR;
    const amountInPaise = Math.round(amountInINR * 100);

    // ---- Create Razorpay order ----
    let order;
    if (amountInPaise > 0) {
      const razorpay = getRazorpay();
      order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: caseCode,
        notes: { eventSlug, teamName, leaderEmail },
      });
    } else {
      // Free event — skip real Razorpay order, use a synthetic marker
      order = { id: `FREE-${caseCode}` };
    }

    // ---- Stage pending Team ----
    const team = await Team.create({
      teamCode,
      teamName,
      eventSlug: event.slug,
      eventName: event.name,
      collegeName,
      department: department || '',
      academicYear: academicYear || '',
      leader: {
        fullName: leaderName,
        email: leaderEmail.toLowerCase(),
        phone: leaderPhone,
        whatsapp: leaderWhatsapp || leaderPhone,
        gender: leaderGender || '',
        tShirtSize: leaderTShirtSize || '',
      },
      members: memberList.map((m, idx) => ({
        memberIndex: idx + 2,
        fullName: m.fullName,
        email: (m.email || '').toLowerCase(),
        phone: m.phone || '',
        college: m.college || collegeName,
        tShirtSize: m.tShirtSize || '',
      })),
      teamSize,
      status: 'PENDING',
    });

    // ---- Stage pending Registration ----
    const registration = await Registration.create({
      caseCode,
      teamId: team._id,
      eventSlug: event.slug,
      amountInINR,
      currency: 'INR',
      paymentStatus: amountInPaise > 0 ? 'PENDING' : 'CAPTURED',
      razorpayOrderId: order.id,
    });

    // Free-event fast path: confirm immediately, no payment needed
    if (amountInPaise === 0) {
      team.status = 'CONFIRMED';
      await team.save();
      sendConfirmationEmail({
        leaderEmail: team.leader.email,
        leaderName: team.leader.fullName,
        teamName: team.teamName,
        eventName: team.eventName,
        caseCode,
        amount: 0,
      }).catch((e) => console.error('Email send failed:', e.message));

      return res.json({
        success: true,
        free: true,
        message: 'Registration confirmed (free event)',
        caseCode,
      });
    }

    return res.json({
      success: true,
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: 'INR',
      caseCode,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/registrations/verify-payment
 * Step 3: verifies the HMAC-SHA256 signature Razorpay returns after checkout,
 * then marks the Registration as CAPTURED and Team as CONFIRMED.
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, caseCode } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !caseCode) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const registration = await Registration.findOne({ caseCode, razorpayOrderId: razorpay_order_id });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found for this order' });
    }

    if (registration.paymentStatus === 'CAPTURED') {
      return res.json({ success: true, message: 'Registration already confirmed', caseCode });
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      registration.paymentStatus = 'FAILED';
      registration.failureReason = 'Signature mismatch';
      await registration.save();
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    registration.paymentStatus = 'CAPTURED';
    registration.razorpayPaymentId = razorpay_payment_id;
    registration.razorpaySignature = razorpay_signature;
    await registration.save();

    const team = await Team.findByIdAndUpdate(
      registration.teamId,
      { status: 'CONFIRMED' },
      { new: true }
    );

    sendConfirmationEmail({
      leaderEmail: team.leader.email,
      leaderName: team.leader.fullName,
      teamName: team.teamName,
      eventName: team.eventName,
      caseCode: registration.caseCode,
      amount: registration.amountInINR,
    }).catch((e) => console.error('Email send failed:', e.message));

    return res.json({ success: true, message: 'Registration confirmed', caseCode: registration.caseCode });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/registrations/track/:caseCode
 */
const trackRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({ caseCode: req.params.caseCode }).populate('teamId');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'No registration found for this Case Code' });
    }

    res.json({
      success: true,
      caseCode: registration.caseCode,
      paymentStatus: registration.paymentStatus,
      qrCheckInStatus: registration.qrCheckInStatus,
      amountInINR: registration.amountInINR,
      team: registration.teamId
        ? {
            teamCode: registration.teamId.teamCode,
            teamName: registration.teamId.teamName,
            eventName: registration.teamId.eventName,
            status: registration.teamId.status,
            teamSize: registration.teamId.teamSize,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, verifyPayment, trackRegistration };
