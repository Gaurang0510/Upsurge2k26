const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Technical', 'Non-Tech', 'Gaming', 'Flagship'],
      default: 'Technical',
    },
    feeInINR: { type: Number, required: true, default: 0 },
    minTeamSize: { type: Number, default: 1 },
    maxTeamSize: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
