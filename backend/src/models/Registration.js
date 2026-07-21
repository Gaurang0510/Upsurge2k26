const mongoose = require('mongoose');
const { PAYMENT_STATUSES } = require('../config/smackathon');

const reviewSchema = new mongoose.Schema(
  {
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    reviewedAt: { type: Date, default: null },
    decision: { type: String, enum: ['VERIFIED', 'REJECTED', ''], default: '' },
    reason: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const paymentProofSchema = new mongoose.Schema(
  {
    screenshotUrl: { type: String, required: true, trim: true },
    screenshotPublicId: { type: String, required: true, trim: true },
    utr: { type: String, required: true, trim: true, uppercase: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    registrationCode: { type: String, required: true, unique: true, index: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    eventSlug: { type: String, required: true, default: 'smackathon-2k26', index: true },
    amountInINR: { type: Number, required: true, default: 599 },
    currency: { type: String, default: 'INR' },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: 'UNDER_REVIEW',
      index: true,
    },
    paymentMethod: { type: String, default: 'UPI' },
    shortlistedEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
    paymentProof: { type: paymentProofSchema, required: true },
    adminReview: { type: reviewSchema, default: () => ({}) },
    lastConfirmationEmailAt: { type: Date, default: null },
  },
  { timestamps: true }
);

registrationSchema.index({ 'paymentProof.utr': 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
