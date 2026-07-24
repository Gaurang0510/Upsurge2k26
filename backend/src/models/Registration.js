const mongoose = require('mongoose');
const { PAYMENT_STATUSES } = require('../config/smackathon');

const reviewSchema = new mongoose.Schema(
  {
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    reviewedAt: { type: Date, default: null },
    decision: { type: String, enum: ['VERIFIED', 'REJECTED', ''], default: '' },
    reason: { type: String, trim: true, default: '', maxlength: 300 },
  },
  { _id: false }
);

const paymentProofSchema = new mongoose.Schema(
  {
    screenshotUrl: { type: String, required: true, trim: true, maxlength: 500 },
    screenshotPublicId: { type: String, required: true, trim: true, maxlength: 200 },
    screenshotFormat: { type: String, required: true, trim: true, lowercase: true, maxlength: 10, default: 'webp' },
    utr: { type: String, required: true, trim: true, uppercase: true, maxlength: 32 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    registrationCode: { type: String, required: true, unique: true, index: true, maxlength: 30 },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    eventSlug: { type: String, required: true, default: 'smackathon-2k26', index: true, maxlength: 60 },
    amountInINR: { type: Number, required: true, default: 599 },
    currency: { type: String, default: 'INR', maxlength: 10 },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: 'UNDER_REVIEW',
      index: true,
    },
    paymentMethod: { type: String, default: 'UPI', maxlength: 30 },
    shortlistedEmail: { type: String, required: true, trim: true, lowercase: true, index: true, maxlength: 254 },
    paymentProof: { type: paymentProofSchema, required: true },
    adminReview: { type: reviewSchema, default: () => ({}) },
  },
  { timestamps: true }
);

registrationSchema.index({ 'paymentProof.utr': 1 }, { unique: true });
// Ensure one registration per team (prevents duplicate registrations)
registrationSchema.index({ teamId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
