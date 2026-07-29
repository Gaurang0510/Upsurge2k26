const mongoose = require('mongoose');

const hackathonSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'smackathon-slots', index: true },
    offlineSlotsTotal: { type: Number, required: true, default: 50, min: 0 },
    onlineSlotsTotal: { type: Number, required: true, default: 30, min: 0 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true }
);

hackathonSettingSchema.statics.getSettings = async function () {
  let settings = await this.findOne({ key: 'smackathon-slots' });
  if (!settings) {
    settings = await this.create({
      key: 'smackathon-slots',
      offlineSlotsTotal: 50,
      onlineSlotsTotal: 30,
    });
  }
  return settings;
};

module.exports = mongoose.model('HackathonSetting', hackathonSettingSchema);
