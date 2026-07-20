const express = require('express');
const router = express.Router();
const {
  requestOtp,
  verifyOtp,
  submitRegistration,
  getRegistrationStatus,
} = require('../controllers/registrationController');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/submit', submitRegistration);
router.get('/status', getRegistrationStatus);

module.exports = router;
