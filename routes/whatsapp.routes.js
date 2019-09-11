'use strict';
const express = require('express');
const router = express.Router();
const { whatsAppInquiry, whatsAppSendMessage, whatsAppSendFile, whatsAppStartCoversation } = require('../controllers/whatsapp.api');

/**
 * Whatsapp query API weebhook
 */
router.post('/query', whatsAppInquiry);

router.post('/send', whatsAppSendMessage);

router.post('/send/file', whatsAppSendFile);

router.post('/conversation/start', whatsAppStartCoversation);

module.exports = router;