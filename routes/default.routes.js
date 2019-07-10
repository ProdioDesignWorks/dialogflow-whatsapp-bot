'use strict';
const express = require('express');
const router = express.Router();
const { ping } = require('../controllers/default.api');

/* Ping */
router.get('/', ping);

/* Ping */
router.get('/ping', ping);

module.exports = router;