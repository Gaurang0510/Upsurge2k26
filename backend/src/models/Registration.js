const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    caseCode: { type: String, required: true, unique: true, index: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    eventSlug: { type: String, required: true, index: true },
    amountInINR: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'CAPTURED', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    qrCheckInStatus: {
      type: String,
      enum: ['PENDING', 'CHECKED_IN'],
      default: 'PENDING',
    },
    checkInTimestamp: { type: Date, default: null },
    failureReason: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', registrationSchema);
