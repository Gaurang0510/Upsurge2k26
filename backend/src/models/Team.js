const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    memberIndex: { type: Number, required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    college: { type: String, trim: true },
    tShirtSize: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', ''], default: '' },
  },
  { _id: false }
);

const leaderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    tShirtSize: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', ''], default: '' },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    teamCode: { type: String, required: true, unique: true, index: true },
    teamName: { type: String, required: true, trim: true },
    eventSlug: { type: String, required: true, index: true },
    eventName: { type: String, required: true },
    collegeName: { type: String, required: true, trim: true },
    department: { type: String, trim: true, default: '' },
    academicYear: { type: String, trim: true, default: '' },
    leader: { type: leaderSchema, required: true },
    members: { type: [memberSchema], default: [] },
    teamSize: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
  },
  { timestamps: true }
);

teamSchema.index({ teamName: 'text', 'leader.fullName': 'text', 'leader.email': 'text' });

module.exports = mongoose.model('Team', teamSchema);
