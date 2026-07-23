const mongoose = require('mongoose');
const { MODE_PREFERENCES, TEAM_STATUSES } = require('../config/smackathon');

const memberSchema = new mongoose.Schema(
  {
    memberIndex: { type: Number, required: true },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    department: { type: String, required: true, trim: true, maxlength: 100 },
    year: { type: String, required: true, trim: true, maxlength: 20 },
  },
  { _id: false }
);

const leaderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    department: { type: String, required: true, trim: true, maxlength: 100 },
    year: { type: String, required: true, trim: true, maxlength: 20 },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    teamCode: { type: String, required: true, unique: true, index: true },
    shortlistEmail: { type: String, required: true, trim: true, lowercase: true, index: true, maxlength: 254 },
    teamName: { type: String, required: true, trim: true, maxlength: 160 },
    eventSlug: { type: String, required: true, default: 'smackathon-2k26', index: true, maxlength: 60 },
    eventName: { type: String, required: true, default: 'SMACKATHON 2K26', maxlength: 120 },
    collegeName: { type: String, required: true, trim: true, maxlength: 160 },
    problemStatement: { type: String, trim: true, default: '', maxlength: 120 },
    modePreference: { type: String, enum: MODE_PREFERENCES, default: 'OFFLINE' },
    githubRepositoryUrl: { type: String, trim: true, default: '', maxlength: 200 },
    leader: { type: leaderSchema, required: true },
    members: { type: [memberSchema], default: [] },
    teamSize: { type: Number, required: true, min: 1, max: 10 },
    status: {
      type: String,
      enum: TEAM_STATUSES,
      default: 'EMAIL_VERIFIED',
      index: true,
    },
    paymentReviewReason: { type: String, trim: true, default: '', maxlength: 300 },
  },
  { timestamps: true }
);

teamSchema.index({ teamName: 'text', 'leader.fullName': 'text', 'leader.email': 'text' });
teamSchema.index({ 'leader.email': 1 }, { unique: true });
teamSchema.index({ 'leader.phone': 1 }, { unique: true });
teamSchema.index({ teamName: 1 }, { unique: true });

module.exports = mongoose.model('Team', teamSchema);
