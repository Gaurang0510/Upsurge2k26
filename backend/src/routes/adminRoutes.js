const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const {
  login,
  me,
  getTeams,
  getTeamById,
  updateTeamStatus,
  getStats,
  exportTeams,
  checkIn,
  listEventsAdmin,
  createEvent,
  updateEvent,
} = require('../controllers/adminController');

// Public (within admin namespace)
router.post('/login', login);

// Protected below this line
router.use(protectAdmin);

router.get('/me', me);
router.get('/stats', getStats);
router.get('/teams', getTeams);
router.get('/teams/:id', getTeamById);
router.patch('/teams/:id/status', updateTeamStatus);
router.get('/export', exportTeams);
router.post('/checkin', checkIn);

router.get('/events', listEventsAdmin);
router.post('/events', createEvent);
router.patch('/events/:id', updateEvent);

module.exports = router;
