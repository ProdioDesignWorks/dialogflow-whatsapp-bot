'use strict';
const express = require('express');
const router = express.Router();
const { whatsAppInquiry, whatsAppSendMessage } = require('../controllers/whatsapp.api');

/**
 * Whatsapp query API weebhook
 */
router.post('/query', whatsAppInquiry);

router.post('/send', whatsAppSendMessage);

module.exports = router;