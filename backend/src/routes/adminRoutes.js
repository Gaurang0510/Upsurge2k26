const express = require('express');
const router = express.Router();
const { protectAdmin, requireRole } = require('../middleware/auth');
const {
  login,
  me,
  getStats,
  getTeams,
  getTeamById,
  getPaymentProof,
  updateTeam,
  reviewPayment,
  exportTeams,
  importShortlist,
  getShortlist,
  removeShortlistEntry,
  getSlotSettings,
  updateSlotSettings,
} = require('../controllers/adminController');

// Public (within admin namespace)
router.post('/login', login);

// Protected below this line — all routes require valid admin token
router.use(protectAdmin);

// Read-only routes — accessible by both ADMIN and STAFF
router.get('/me', me);
router.get('/stats', getStats);
router.get('/settings/slots', getSlotSettings);
router.get('/teams', getTeams);
router.get('/teams/:id', getTeamById);
router.get('/teams/:id/payment-proof', getPaymentProof);
router.get('/shortlist', getShortlist);

// Mutation routes — ADMIN only (AUD-003 fix)
router.patch('/settings/slots', requireRole('ADMIN'), updateSlotSettings);
router.patch('/teams/:id', requireRole('ADMIN'), updateTeam);
router.patch('/teams/:id/review-payment', requireRole('ADMIN'), reviewPayment);
router.get('/export', requireRole('ADMIN'), exportTeams);
router.post('/shortlist/import', requireRole('ADMIN'), importShortlist);
router.delete('/shortlist/:email', requireRole('ADMIN'), removeShortlistEntry);

module.exports = router;
