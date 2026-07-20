const Event = require('../models/Event');

// GET /api/v1/events
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json({ success: true, count: events.length, events });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/events/:slug
const getEventBySlug = async (req, res, next) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug, isActive: true });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEvents, getEventBySlug };
