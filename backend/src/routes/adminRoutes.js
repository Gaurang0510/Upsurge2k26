const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const {
  login,
  me,
  getStats,
  getTeams,
  getTeamById,
  updateTeam,
  reviewPayment,
  resendConfirmation,
  exportTeams,
  importShortlist,
  getShortlist,
} = require('../controllers/adminController');

// Public (within admin namespace)
router.post('/login', login);

// Protected below this line
router.use(protectAdmin);

router.get('/me', me);
router.get('/stats', getStats);
router.get('/teams', getTeams);
router.get('/teams/:id', getTeamById);
router.patch('/teams/:id', updateTeam);
router.patch('/teams/:id/review-payment', reviewPayment);
router.post('/teams/:id/resend-confirmation', resendConfirmation);
router.get('/export', exportTeams);
router.get('/shortlist', getShortlist);
router.post('/shortlist/import', importShortlist);

module.exports = router;
