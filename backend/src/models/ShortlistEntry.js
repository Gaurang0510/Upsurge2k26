const mongoose = require('mongoose');

const shortlistEntrySchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    teamName: { type: String, trim: true, default: '' },
    leaderName: { type: String, trim: true, default: '' },
    invitationCode: { type: String, unique: true, sparse: true, trim: true, uppercase: true, index: true },
    registrationSubmittedAt: { type: Date, default: null },
    importedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    importBatchLabel: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShortlistEntry', shortlistEntrySchema);
