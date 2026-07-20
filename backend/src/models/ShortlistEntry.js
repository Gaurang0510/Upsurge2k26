const mongoose = require('mongoose');

const shortlistEntrySchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    teamName: { type: String, trim: true, default: '' },
    leaderName: { type: String, trim: true, default: '' },
    importedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    importBatchLabel: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpLastSentAt: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    emailVerifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShortlistEntry', shortlistEntrySchema);
