const { SMACKATHON_CONFIG } = require('../config/smackathon');
const { getSlotStats } = require('../utils/slotHelper');

// GET /api/v1/events
const getEvents = async (req, res, next) => {
  try {
    const slots = await getSlotStats();
    res.json({ success: true, count: 1, events: [{ ...SMACKATHON_CONFIG, slots }] });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/events/:slug
const getEventBySlug = async (req, res, next) => {
  try {
    if (req.params.slug !== SMACKATHON_CONFIG.slug) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    const slots = await getSlotStats();
    res.json({ success: true, event: { ...SMACKATHON_CONFIG, slots } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEvents, getEventBySlug };
