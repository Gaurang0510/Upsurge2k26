const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, trackRegistration } = require('../controllers/registrationController');

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/track/:caseCode', trackRegistration);

module.exports = router;
