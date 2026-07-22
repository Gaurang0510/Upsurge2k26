const mongoose = require('mongoose');
const { MODE_PREFERENCES, TEAM_STATUSES } = require('../config/smackathon');

const memberSchema = new mongoose.Schema(
  {
    memberIndex: { type: Number, required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const leaderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    teamCode: { type: String, required: true, unique: true, index: true },
    shortlistEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
    teamName: { type: String, required: true, trim: true },
    eventSlug: { type: String, required: true, default: 'smackathon-2k26', index: true },
    eventName: { type: String, required: true, default: 'SMACKATHON 2K26' },
    collegeName: { type: String, required: true, trim: true },
    problemStatement: { type: String, trim: true, default: '' },
    modePreference: { type: String, enum: MODE_PREFERENCES, default: 'OFFLINE' },
    leader: { type: leaderSchema, required: true },
    members: { type: [memberSchema], default: [] },
    teamSize: { type: Number, required: true },
    status: {
      type: String,
      enum: TEAM_STATUSES,
      default: 'EMAIL_VERIFIED',
      index: true,
    },
    paymentReviewReason: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

teamSchema.index({ teamName: 'text', 'leader.fullName': 'text', 'leader.email': 'text' });
teamSchema.index({ 'leader.email': 1 }, { unique: true });
teamSchema.index({ 'leader.phone': 1 }, { unique: true });
teamSchema.index({ teamName: 1 }, { unique: true });

module.exports = mongoose.model('Team', teamSchema);
