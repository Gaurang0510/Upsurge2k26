const Team = require('../models/Team');
const Registration = require('../models/Registration');
const HackathonSetting = require('../models/HackathonSetting');

const getSlotStats = async () => {
  const settings = await HackathonSetting.getSettings();

  // Any registration whose payment proof has not been rejected occupies a slot
  const activeRegistrations = await Registration.find({
    paymentStatus: { $ne: 'REJECTED' },
  })
    .select('teamId')
    .lean();

  const activeTeamIds = activeRegistrations.map((reg) => reg.teamId);

  const [offlineUsed, onlineUsed] = await Promise.all([
    Team.countDocuments({ _id: { $in: activeTeamIds }, modePreference: 'OFFLINE' }),
    Team.countDocuments({ _id: { $in: activeTeamIds }, modePreference: 'ONLINE_REQUEST' }),
  ]);

  const offlineTotal = Number(settings.offlineSlotsTotal ?? 50);
  const onlineTotal = Number(settings.onlineSlotsTotal ?? 30);

  const offlineRemaining = Math.max(0, offlineTotal - offlineUsed);
  const onlineRemaining = Math.max(0, onlineTotal - onlineUsed);

  return {
    offline: {
      total: offlineTotal,
      used: offlineUsed,
      remaining: offlineRemaining,
    },
    online: {
      total: onlineTotal,
      used: onlineUsed,
      remaining: onlineRemaining,
    },
    updatedAt: settings.updatedAt || new Date(),
  };
};

module.exports = {
  getSlotStats,
};
