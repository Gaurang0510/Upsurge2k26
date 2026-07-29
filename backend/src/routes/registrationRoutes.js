const express = require('express');
const router = express.Router();
const {
  verifyInvitation,
  submitRegistration,
  getRegistrationSlots,
  getRegistrationStatus,
} = require('../controllers/registrationController');

router.post('/verify-invitation', verifyInvitation);
router.post('/submit', submitRegistration);
router.get('/slots', getRegistrationSlots);
router.get('/status', getRegistrationStatus);

module.exports = router;
