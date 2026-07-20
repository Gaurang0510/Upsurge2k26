const crypto = require('crypto');
const Registration = require('../models/Registration');
const Team = require('../models/Team');
const { sendConfirmationEmail } = require('../utils/sendEmail');

/**
 * POST /api/v1/payments/webhook
 * Handles asynchronous Razorpay webhook events (payment.captured, payment.failed).
 * This is a safety net in case the client-side verify-payment call never completes
 * (e.g. user closes the browser tab right after paying).
 *
 * IMPORTANT: This route must receive the RAW request body for signature verification,
 * which is wired up in server.js via express.raw() on this specific path.
 */
const handleWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!webhookSecret) {
      console.warn('⚠️  RAZORPAY_WEBHOOK_SECRET not set — skipping webhook signature check (dev only).');
    } else {
      const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(req.body) // raw Buffer
        .digest('hex');

      if (expected !== signature) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const payload = JSON.parse(req.body.toString());
    const event = payload.event;
    const paymentEntity = payload?.payload?.payment?.entity;

    if (!paymentEntity) {
      return res.status(200).json({ success: true, message: 'No payment entity, ignored' });
    }

    const orderId = paymentEntity.order_id;
    const registration = await Registration.findOne({ razorpayOrderId: orderId });

    if (!registration) {
      console.warn(`Webhook: no registration found for order ${orderId}`);
      return res.status(200).json({ success: true, message: 'Registration not found, ignored' });
    }

    if (event === 'payment.captured' && registration.paymentStatus !== 'CAPTURED') {
      registration.paymentStatus = 'CAPTURED';
      registration.razorpayPaymentId = paymentEntity.id;
      await registration.save();

      const team = await Team.findByIdAndUpdate(
        registration.teamId,
        { status: 'CONFIRMED' },
        { new: true }
      );

      if (team) {
        sendConfirmationEmail({
          leaderEmail: team.leader.email,
          leaderName: team.leader.fullName,
          teamName: team.teamName,
          eventName: team.eventName,
          caseCode: registration.caseCode,
          amount: registration.amountInINR,
        }).catch((e) => console.error('Email send failed (webhook):', e.message));
      }
    }

    if (event === 'payment.failed') {
      registration.paymentStatus = 'FAILED';
      registration.failureReason = paymentEntity.error_description || 'Payment failed';
      await registration.save();
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleWebhook };
