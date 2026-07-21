const express = require('express');
const router = express.Router();
const {
  verifyInvitation,
  submitRegistration,
  getRegistrationStatus,
} = require('../controllers/registrationController');

router.post('/verify-invitation', verifyInvitation);
router.post('/submit', submitRegistration);
router.get('/status', getRegistrationStatus);

module.exports = router;
