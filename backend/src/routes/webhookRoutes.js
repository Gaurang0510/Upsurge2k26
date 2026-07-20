const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/webhookController');

// NOTE: raw body parsing for this route is configured in server.js
router.post('/webhook', handleWebhook);

module.exports = router;
